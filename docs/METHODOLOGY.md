# Behind the analysis

## Scope and contribution

Lumba Digital's contribution is source inspection, reproducible quality checks, scenario arithmetic and editorial presentation. Original data collection belongs to Smart Solutech and Transport for Cairo and the organisations credited in DATA_AUDIT. The current release does not contain a verified Lusaka journey analysis.

Labels:
- **Observed / source records:** factual inventory, data dates and source field values. This label does not make GTFS estimates observed exact timings.
- **Modelled:** survey-derived GTFS estimates where provenance says so, and calculations under explicit assumptions.
- **Proposed:** hypothetical service or alignment; never an operating-service claim.
- **Demonstration:** synthetic fixture and schematic, not evidence about Lusaka. No synthetic values enter the source audit.

## Journey model

Input: `data/fixtures/journey.json`. Pure TypeScript implementation: `src/lib/model.ts`. Times are minutes, traffic is a dimensionless multiplier and fleet is vehicles. Geometry is never used to estimate timings.

Baseline total = access walking + initial waiting + sum(onboard leg minutes × baseline traffic multiplier) + transfer walking + transfer waiting + egress walking.

Proposal total = access walking + interval / 2 + sum(onboard leg minutes × proposal traffic multiplier) + egress walking.

Every component belongs to the same fictional A → B journey boundary. The fixture has two baseline bus legs and one transfer; proposal has one leg. Do not reuse this data shape for multiple transfers without explicitly representing and testing every transfer. Current code is intentionally small for a single selected comparison, not a routing engine.

Fixture inputs:

| Minutes | Baseline | Proposal |
| --- | ---: | ---: |
| Access walking | 8 | 10 |
| Egress walking | 7 | 8 |
| Initial waiting | 12 | 7.5 at default 15-minute interval |
| Transfer walking | 4 | 0 |
| Transfer waiting | 10 | 0 |
| Onboard including stops | 24 + 18 | 32 |
| Default total | 83 | 57.5 |

All values in this table are synthetic. Baseline waiting is a fixed fixture, not inferred from service headways. Proposal waiting assumes random passenger arrivals, regular departures and sufficient capacity; it cannot automatically represent fill-and-go operation or denied boarding. Times are displayed to one decimal for arithmetic transparency, not to imply measurement precision.

Both traffic controls scale their option's onboard time, including stops. Walks and fixed baseline waits do not change. This is a deliberately simple sensitivity model; it does not model intersections, boarding delays, stochastic congestion or reliability distributions. Distinct controls allow the proposal to face more severe delays. With a 60-minute interval and proposal multiplier 2.5, baseline multiplier 1, the proposal takes 128 minutes versus 83; **45 minutes more**. We do not clamp losses to zero.

Difference = baseline total − proposal total. Positive means less time with the proposal; negative means more. A time saving says nothing about demand, viability, fares or profitability.

## Operating fleet

Round trip = 2 × traffic-adjusted proposal onboard minutes + 16 recovery minutes.

Operating fleet = ceil(round trip / departure interval).

Default: ceil((2 × 32 + 16) / 15) = **6 operating vehicles**, plus **1 separately selected spare**. Onboard minutes already include stops; do not add dwell twice. Equal return time is an assumption. The recovery is synthetic and held fixed. More frequent departures increase fleet demand; traffic lengthens the cycle. Spares never silently enter the operating calculation.

This calculation does not establish sufficient vehicle capacity, driver schedules, maintenance provision, finance, or demand. Reject nonfinite/negative time inputs, nonpositive traffic/interval and fractional/negative spares. Do not infer bounds on actual services from the UI slider ranges.

## Maps and basemap choice

For this skeleton, the deliberate choice is **no geographic basemap**. MapLibre draws original schematic GeoJSON at arbitrary coordinates around 0,0; these coordinates are not Lusaka locations. Neither its topology nor its line shape comes from the survey or a road router. Attribution: “Schematic © Lumba Digital · synthetic fixture.” No tiles, remote fonts, third-party basemap attribution obligations, API keys or tile-server quotas apply. The diagram is always labelled demonstration/not to scale. The hero and fallback are original SVG illustrations.

MapLibre is lazy-loaded near the story. IntersectionObserver selects a scene, changes line visibility and resets framing. Solid/dashed lines supplement colour. Keyboard zoom controls and a reset are available; scroll-wheel zoom is disabled to avoid trapping narrative scroll. Reduced-motion users get immediate framing with no animation. Text notes and the HTML breakdown table carry the substantive information. A static diagram remains if loading/WebGL fails; the default table also works with JavaScript disabled.

Before adding real maps: confirm survey reuse terms; choose an approved basemap whose provider terms allow the intended public traffic, document attribution, tile/glyph endpoints, caching, quotas and privacy, and retain fallback. Do not use the OSM standard public tile servers as an assumed unlimited production basemap.

## Validation and limitations

Five Node tests cover complete boundaries and transfers, frequency/fleet ceilings and separate spares, independent traffic scaling, a worse-performing proposal, and invalid units/inputs. Browser checks cover scenario changes, keyboard input, reset, scene transitions, responsive overflow, reduced motion, no-JS defaults and WebGL fallback. See PROGRESS for executed results.

Internal consistency is not accuracy. Walking times are not measured; traffic is synthetic; no fare, ridership, current-service or profitability estimate is presented. The feed's calendar ended in 2024. Future selected journeys need evidence-linked leg IDs, service date/window, transfer feasibility, locally checked walks, source provenance and uncertainty ranges. The data design can be expanded to up to three selected journeys after one is verified; there is no arbitrary citywide routing.
