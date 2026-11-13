#!/usr/bin/env bash
# Verify a bundle OFFLINE: checksums, then signature with the pinned public key / Sigstore bundle.
set -euo pipefail

TAR="${1:?usage: verify.sh <bundle.tar> [cosign.pub]}"
PUB="${2:-ubao-release.pub}"   # public key shipped out-of-band with the subscription (pinned)

[ -f "${TAR}.cosign.bundle" ] || { echo "missing ${TAR}.cosign.bundle" >&2; exit 1; }
cosign verify-blob --key "${PUB}" --bundle "${TAR}.cosign.bundle" "${TAR}"

work="$(mktemp -d)"; trap 'rm -rf "${work}"' EXIT
tar -C "${work}" -xf "${TAR}"
( cd "${work}"/*/ && sha256sum --check --strict SHA256SUMS )
echo "OK: signature and checksums valid"
