#!/usr/bin/env bash
# Build an air-gapped bundle on a CONNECTED host. Skeleton: image list and tooling are provisional.
# Requires: docker, helm, skopeo (Apache-2.0), cosign (Apache-2.0), syft (Apache-2.0) or cargo-cyclonedx.
set -euo pipefail

VERSION="${1:?usage: bundle.sh <version> [outdir]}"
OUT="${2:-dist}/ubao-airgap-${VERSION}"
REGISTRY="${REGISTRY:-ghcr.io/ubao}"
IMAGES=(
  "${REGISTRY}/ubao-server:${VERSION}"
  "docker.io/library/postgres:16-alpine"
  "docker.io/library/caddy:2-alpine"
)
# Optional (AGPL-3.0, separate process): add minio only if the customer wants bundled S3.

mkdir -p "${OUT}"/{images,chart,sbom,plugins,plugin-registry,docs,scripts}

for img in "${IMAGES[@]}"; do
  name="$(echo "${img}" | tr '/:' '__')"
  skopeo copy --all "docker://${img}" "oci-archive:${OUT}/images/${name}.tar:${img}"
  syft "${img}" -o cyclonedx-json="${OUT}/sbom/${name}.cdx.json"
  cosign verify "${img}" \
    --certificate-identity-regexp "https://github.com/ubao/.*" \
    --certificate-oidc-issuer https://token.actions.githubusercontent.com >/dev/null
done

helm package "$(dirname "$0")/../../helm/ubao" --version "${VERSION}" -d "${OUT}/chart"

# Mandatory first-party plugins (.ubx, signed) + mirrored plugin registry index (ADR-0010)
if [ -d "${PLUGINS_DIR:-}" ]; then cp "${PLUGINS_DIR}"/*.ubx "${OUT}/plugins/"; fi
if [ -d "${PLUGIN_REGISTRY_DIR:-}" ]; then cp -r "${PLUGIN_REGISTRY_DIR}/." "${OUT}/plugin-registry/"; fi

cp "$(dirname "$0")/verify.sh" "$(dirname "$0")/load-images.sh" "${OUT}/scripts/"
cat > "${OUT}/manifest.json" <<JSON
{ "format": 1, "version": "${VERSION}", "created": "$(date -u +%FT%TZ)", "schema_migrations": "see docs/upgrade-and-rollback.md" }
JSON

( cd "${OUT}" && find . -type f ! -name SHA256SUMS ! -name 'SHA256SUMS.*' -print0 | sort -z | xargs -0 sha256sum > ../SHA256SUMS.tmp && mv ../SHA256SUMS.tmp SHA256SUMS )
tar -C "$(dirname "${OUT}")" -cf "${OUT}.tar" "$(basename "${OUT}")"
cosign sign-blob --yes "${OUT}.tar" --bundle "${OUT}.tar.cosign.bundle"
echo "Bundle: ${OUT}.tar (+ .cosign.bundle)"
