# bench/canvas — ADR-0004 canvas bench (Story 0.4b)

Zero-dependency Node >= 22 toolkit: seeded scene generator, replayable traces, backend contract, report schema + grading, orchestration.
Protocol and decision rules: `docs/architecture/spikes/spike-0.4b-canvas-bench.md`.

    npm test                                   # 21 tests (generator, traces, stats, thresholds, report, golden checksums)
    node src/cli.mjs gen --variant 10k         # -> scenes/scene-10k-clustered-seed42.json
    node src/cli.mjs traces                    # -> traces/*.json
    node src/cli.mjs run --backend null        # pipeline self-test -> reports/selftest-null.json

Committed: `scenes/example-1k-clustered-seed42.json` (sha256 in `scenes/CHECKSUMS.json`, which also lists the 10k/25k and trace checksums). Larger scenes are regenerated (gitignored).
The scene contains no pixels: images are descriptors (`srcW/srcH/pixelSeed`); backends synthesise deterministic noise/gradient bitmaps from `pixelSeed`.
Text is original (see `src/text-pool.mjs`). All code is original MIT.
