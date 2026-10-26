# Progress

Updated 26 October 2026.

## Milestone 1 — workspace and audit: completed for initial scope

- Inspected the existing repository; it contained only README and MIT licence. Preserved licence and existing checkout; no worktree created.
- Established Astro 5 / TypeScript / plain CSS / MapLibre and Python 3.12 with pinned pandas, GeoPandas and openpyxl dependencies.
- Inspected the complete GitLab inventory, all GTFS tables, metadata workbook and five selected GeoJSON layers. Kept raw inputs unchanged and ignored.
- Recorded source revision and SHA-256 hashes. Verified a fresh download of every selected file in a separate temporary location; repeat fetching verifies existing files without overwriting.
- Wrote AGENTS, README, DATA_AUDIT, METHODOLOGY, STORYBOARD and this progress log.

Why: establish what evidence supports before choosing a story. Quality checks show internal consistency, not present-day accuracy or completeness. Six other spatial layers are inventoried but not fully audited.

## Milestone 2 — storyboard and shortlist: initial version completed; selection pending

- Refined all eight scenes around evidence constraints.
- Shortlisted existing City Market–UTH Hospital, Kasupe–Town (Lumumba), and Mutendere–UTH Hospital corridors for further investigation.
- Did not select an actual journey, infer missing service, or invent a problematic baseline. A frequency/reliability improvement on an existing corridor is a valid next direction.

Why: the surveyed feed ended in 2024; reuse terms and exact timing estimation procedure need clarification. Existing direct routes offer evidence-grounded candidates without forcing an orbital proposal.

## Milestone 3 — local narrative and comparison: completed as a demonstration

- Built an eight-scene responsive editorial page with original SVG artwork, lazy-loaded scroll-linked MapLibre schematic, clear data labels, evidence notes and placeholder collaboration/contact details.
- Built a full-boundary synthetic comparison with walking, initial wait, two baseline onboard legs, transfer walking/waiting and egress. Proposal has one onboard leg and no transfer.
- Added keyboard-operable frequency, independent traffic and spare controls; a readable breakdown table; and fleet with separately shown spares.
- Made adverse proposal outcomes possible and visible. Baseline 83 minutes; default proposal 57.5 minutes. At interval 60, proposal traffic 2.5 and baseline traffic 1, proposal takes 128 minutes (45 more).
- Kept map and analytical model independent. Diagram coordinates are arbitrary, not real roads. No external basemap/tiles/glyphs or API keys.

Why: test and explain the experience end to end without presenting invented timings as evidence. No framework beyond the requested stack, frontend UI framework, backend or citywide router was added.

## Milestone 4 — verified analytical outputs: partially completed

Aggregate audit findings are connected to the website; source/date/credits and downloadable audit are visible. Real journey-level outputs and surveyed map geometry are **not connected**. The synthetic fixture remains separate in data, interface and documentation.

Blocked research requirements:
1. Explicit applicable source reuse licence or written permission (not found in inventory/README/workbook).
2. Detailed GTFS travel-time/headway estimation method and sampling limitations. Workbook confirms survey-derived estimates; all 9,219 stop-time rows have timepoint=0.
3. Current-service and field validation of one selected journey, transfer/access paths, waiting practices and capacity; road suitability and demand before any real proposal.

The dataset is accessible; there is no missing secret or download access blocker. No credentials or contact values have been requested or invented. The business and inspiration URLs returned HTTP 403 to curl here; no assets or claims were drawn from them.

## Milestone 5 — initial validation and deployment guidance: completed for prototype

Executed checks:

| Check | Outcome |
| --- | --- |
| Frozen npm installation (`npm ci`) | Passed |
| Pinned Python installation / repeat install | Passed |
| `npm run check` | 0 errors, warnings or hints |
| `npm test` | 5 tests passed; no skips or expected failures |
| `npm run build` | Static page built successfully |
| Fresh source fetch | All 10 selected source/metadata files verified against SHA-256 |
| GTFS key consistency | No broken referenced keys or duplicate inspected primary IDs |
| GTFS time/coordinate checks | No backward times, repeated stop sequences or invalid coordinate ranges |
| GeoPandas validity, selected five layers | No invalid/empty geometries |
| Production preview HTML and fixture requests | HTTP 200 with expected title and demonstration status |
| Chromium, desktop 1440×1000 | Default/adverse scenario, totals, fleet, reset, keyboard input and scroll scene transitions passed |
| Chromium, mobile 390×844 | No horizontal overflow; comparison readability visually inspected |
| Axe WCAG 2 A/AA + 2.1 AA automated scans | Zero violations on desktop and mobile after contrast corrections |
| Reduced motion | Immediate/nonanimated treatment enabled; CSS smooth scrolling disabled |
| JavaScript disabled | Static diagram and default table remain readable |
| WebGL unavailable | Static diagram remains; comparison controls still update |
| Normal browser console/page errors | None recorded |
| Public outputs | Only favicon, aggregate audit JSON and synthetic fixture; no raw geometry |
| `git diff --check` | Passed |

The complete functional browser checks were rerun against the built static production preview. Browser tools ran from a temporary testing installation using existing system Chromium; no browser testing service is required for the site. Automated accessibility scans are not a full accessibility certification. Other browsers, representative older/low-powered devices, assistive-technology testing and field research remain unrun.

Build warning: the lazy MapLibre chunk is approximately 1.06 MB minified / 287 KB gzip. The initial interaction script is approximately 4 KB minified / 1.8 KB gzip. The map is deferred until the reader approaches the story; the warning has not been suppressed. Mobile network/device performance remains worth measuring before public release.

## Reusable environment and release status

Saved `install_script` and `start_skill` in the cloud environment draft, including working directory, pinned installation, Node/Python workflow, service restart/readiness checks, synthetic-data caveats and the instruction to use this isolated checkout without creating a worktree. Confirmed draft persistence; saving does not publish the environment or website. Review/save the environment settings and publish the **environment snapshot** to make this prepared setup available for reuse. Fresh-task restoration has not been tested.

Development server and static preview were started locally for validation. Processes do not survive environment snapshots; restart using saved instructions. The user subsequently authorised committing and pushing this prototype to the existing GitHub repository. This transfers the source for review; it does not deploy the website. No site deployment, DNS change, external message or live-site replacement has been performed. Cloudflare Pages guidance is in README; provider deployment remains untested and unauthorised.

## Next useful step

Obtain reuse terms and estimation notes from the credited producers, then agree one candidate journey with a local partner. Validate current services and access/egress, prepare evidence-linked GeoJSON/JSON in Python, and replace the fixture only when each real input has provenance and limitations. Until then, this local skeleton supports design review and honest model exploration.
