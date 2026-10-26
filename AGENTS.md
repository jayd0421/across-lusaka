# Across Lusaka

Public-facing Lumba Digital geospatial storytelling project. Explain public transport connections through a small editorial story and transparent selected-journey scenarios. This is research and portfolio work, not an advertised bus service or profitability claim.

## Working conventions
- Astro 5, strict TypeScript, plain CSS, MapLibre GL JS. Static output for Cloudflare Pages; no backend or arbitrary OD router without demonstrated need.
- Use the existing isolated checkout; do not create a Git worktree unless requested.
- Python 3.12 with pandas/GeoPandas for analysis. Raw data is immutable and ignored. Outputs live in `data/processed`; synthetic examples in `data/fixtures`.
- Read `docs/PROGRESS.md` and `docs/DATA_AUDIT.md` before changing evidence or narrative claims.
- Preserve clear separation between source observations, estimates/modelled values, and proposals. Synthetic fixtures must be labelled in data, UI and documentation. Never silently replace missing evidence.
- Do not invent accounts, fares, ridership, timings, demand, research findings or road suitability. Missing survey records do not establish absent service.
- Dataset reuse permission is unresolved. Do not publish raw data, source geometries or source map assets until explicit applicable reuse terms are established. The project's MIT licence does not license third-party data.
- Keep source URLs, revisions, dates and assumptions attached to outputs. Credit Smart Solutech, Transport for Cairo and the commissioning/funding organisations separately from Lumba Digital analysis.
- Full door-to-door comparisons include access/egress, all waits, onboard legs and transfers exactly once. Half-headway waiting requires random arrivals, regular departures and capacity. Never automatically apply it to fill-and-go operation.
- Operating fleet = ceil(round trip including stops/recovery / interval). Show spares separately. No profitability inference.
- Keyboard controls, readable tables, line styles in addition to colour, reduced motion, responsive layouts and map fallback are required.
- Keep secrets out of Git. Do not publish, deploy, alter DNS or replace live sites without explicit instruction.

## Commands
Node 24 (`.nvmrc`); set `ASTRO_TELEMETRY_DISABLED=1` in restricted cloud machines.
- `npm ci`, `npm run dev -- --port 4321`
- `npm run check`, `npm test`, `npm run build`
- Python audit steps and verification: README and docs/DATA_AUDIT.md.
- After model changes, test totals, transfers, units, adverse proposals and fleet ceiling. After UI changes, verify controls, mobile, keyboard and fallback. Do not substitute a build for a functional check.
- Maintain STORYBOARD, METHODOLOGY, DATA_AUDIT and PROGRESS as decisions and evidence evolve.
