# Ubao server image. PLACEHOLDER: crate/binary names (ubao-server) are provisional until the workspace exists.
# Build:  docker build -f deploy/docker/Dockerfile -t ubao-server:dev .
# Base images: rust (MIT/Apache-2.0), gcr.io/distroless (Apache-2.0).
FROM rust:1-bookworm AS build
WORKDIR /src
COPY Cargo.toml Cargo.lock ./
COPY crates ./crates
COPY apps ./apps
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/src/target \
    cargo build --release --locked -p ubao-server \
 && install -D target/release/ubao-server /out/ubao-server

FROM gcr.io/distroless/cc-debian12:nonroot
COPY --from=build /out/ubao-server /usr/local/bin/ubao-server
USER 65532:65532
EXPOSE 8080
ENV BIND_ADDR=0.0.0.0:8080
# Exec form: distroless has no shell/curl; the binary implements `healthcheck` (GET /healthz on localhost).
HEALTHCHECK --interval=15s --timeout=3s --start-period=20s --retries=5 \
  CMD ["/usr/local/bin/ubao-server", "healthcheck"]
ENTRYPOINT ["/usr/local/bin/ubao-server"]
CMD ["serve"]
# Run with: --read-only --tmpfs /tmp --cap-drop ALL (writable data only on mounted volumes /data/*)
