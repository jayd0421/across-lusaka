# Across Lusaka

**Exploring everyday journeys—and what better public transport connections could change.**

A small, static, editorial prototype for Lumba Digital: eight story scenes, a scroll-linked MapLibre diagram, an interactive door-to-door comparison, operational fleet estimates, evidence notes and collaboration prompts.

**Current status:** real source data audited; all journey comparisons and displayed alignments are explicitly synthetic. No actual journey or proposed service has been validated. The source dataset's reuse licence remains unresolved, so survey geometries are not shipped with the site. This project is not a commercial bus service or a profitability assessment.

## Run locally

Requires Node 24 (see `.nvmrc`) and npm. No API keys, database, GIS server or external map tiles are needed.

```sh
cd /workspace/across-lusaka  # or your local checkout
export ASTRO_TELEMETRY_DISABLED=1
npm ci
npm run dev -- --port 4321
```

The terminal reports the local address. Open it on your development machine. The cloud onboarding interface does not provide localhost previews; the server is verified with internal requests and Chromium.

```sh
npm run check
npm test
npm run build
npm run preview -- --port 4322
```

`dist/` is the static site. Python and raw data are **not required** to run/build it: audited aggregate findings and the labelled fixture are checked in. Use the existing isolated checkout; no worktree is necessary.

## Understand the implementation

| File | Responsibility |
| --- | --- |
| `src/pages/index.astro` | Server-rendered narrative, evidence, accessible table and default results |
| `src/styles/global.css` | Responsive editorial design, map styles, reduced-motion and print rules |
| `src/lib/model.ts` | Pure calculation function: complete journeys, difference and fleet |
| `src/lib/story.ts` | Form updates, accessible result announcement, lazy map loading |
| `src/lib/map.ts` | Local MapLibre schematic and story-scene transitions |
| `data/fixtures/journey.json` | Synthetic inputs, units and assumptions; no real origin/destination |
| `data/processed/` | Aggregate audit outputs; no surveyed geometry |
| `public/data/` | Explicitly selected downloadable audit and demo fixture |
| `scripts/` | Fetch, inspect and explicitly sync public outputs |

Astro supplies static HTML. Browser TypeScript updates the scenario; there is no server calculation. MapLibre is loaded on approach to the map. Its synthetic diagram uses no basemap, remote glyphs, tiles or tokens. The static diagram and text remain available if WebGL fails. The default table remains readable without JavaScript.

## Reproduce the audit

Python 3.12 recommended. These tools do not edit source data.

```sh
python -m venv .venv
.venv/bin/pip install -r requirements.txt
python scripts/fetch_source.py
python scripts/audit_data.py
.venv/bin/python scripts/audit_geometry.py
```

The fetcher downloads pinned GitLab inputs using HTTPS and verifies recorded SHA-256 hashes. Existing changed files cause a refusal to overwrite. Raw data stays in ignored `data/raw/lusaka/`. Auditing writes aggregate JSON. To update the website's downloadable copies after reviewing evidence/fixtures:

```sh
python scripts/sync_public_data.py
npm run check
npm test
npm run build
```

Verify reproducibility by rerunning the audit and reviewing the JSON diff. A fresh fetch was also tested in a separate temporary destination. `requirements.txt` pins the Python environment, including pandas, GeoPandas and openpyxl. See [data audit](docs/DATA_AUDIT.md) for exact scope and [methodology](docs/METHODOLOGY.md) for calculations.

## Deployment preparation — Cloudflare Pages

No deployment has been performed. When authorised, create a Pages project linked to this repository:

- Framework: Astro; root: repository root.
- Node version: `24` (`NODE_VERSION=24` if needed).
- Build command: `npm run build`.
- Output directory: `dist`.
- Optional build variable: `ASTRO_TELEMETRY_DISABLED=1`.
- No server adapter, functions, runtime secrets or Python build step required.

Review evidence labels, contact details, data rights and accessibility before making the project public. Do not change `lumbadigital.com` or DNS as part of local development. Local static preview was tested; Cloudflare deployment has not been tested.

## Research and design notes

- [Storyboard and candidate journeys](docs/STORYBOARD.md)
- [Source inventory, licence and quality findings](docs/DATA_AUDIT.md)
- [Comparison model and map usage conditions](docs/METHODOLOGY.md)
- [Progress, validation, blockers and next steps](docs/PROGRESS.md)

Source: [DigitalTransport4Africa / Lusaka](https://gitlab.com/digitaltransport/data/africa/lusaka). Collected by Smart Solutech and Transport for Cairo under a WRI-led consortium for Low-Carbon Transport Futures in Zambia, sponsored by Climate Compatible Growth and funded by FCDO. Lumba Digital contributes this audit, model and storytelling implementation.

The existing MIT licence applies to project code. It does not establish permission for the third-party survey or maps. No external photographs, fonts or reference-site assets are used.
