#!/usr/bin/env bash
# Load bundle images into a private registry (default) or the local Docker daemon.
set -euo pipefail

DIR="${1:?usage: load-images.sh <bundle-dir> [registry-host:port]}"
TARGET="${2:-}"

for f in "${DIR}"/images/*.tar; do
  if [ -n "${TARGET}" ]; then
    ref="$(basename "${f}" .tar)"
    src_ref="$(tar -xOf "${f}" index.json | sed -n 's/.*"org.opencontainers.image.ref.name":"\([^"]*\)".*/\1/p' | head -n1)"
    dest="${TARGET}/${src_ref#*/}"
    skopeo copy --dest-tls-verify="${SKOPEO_DEST_TLS_VERIFY:-true}" "oci-archive:${f}" "docker://${dest}"
    echo "pushed ${ref} -> ${dest}"
  else
    docker load -i "${f}"
  fi
done
