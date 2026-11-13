# deploy/docker — server image

`Dockerfile`: multi-stage (Rust build → distroless `cc-debian12:nonroot`), UID 65532, no shell, read-only root filesystem compatible, `HEALTHCHECK` via `ubao-server healthcheck` → `/healthz`.

**Placeholder:** the `ubao-server` crate does not exist yet; package/binary names and the `healthcheck`/`init` subcommands are provisional contracts for the server team.

Build from the repo root (note the `.dockerignore` next to the Dockerfile is honoured by BuildKit when named `Dockerfile.dockerignore`; copy it to the root or pass `--file` context accordingly):
```sh
docker buildx build -f deploy/docker/Dockerfile --platform linux/amd64,linux/arm64 -t ghcr.io/ubao/ubao-server:<tag> .
```
CI (planned): sign with cosign keyless (Sigstore), attach CycloneDX SBOM (`cargo cyclonedx`), pin base images by digest.
Licences: Rust image (MIT/Apache-2.0), distroless (Apache-2.0).
