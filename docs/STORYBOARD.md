# Storyboard and candidate journeys

The first release is an editorial skeleton with a synthetic example, **not** a researched claim that a particular Lusaka connection is difficult. The actual journey remains unselected. Keep the scene progression, but change claims to match evidence.

| Scene | Current supported claim | Visual / interaction | Evidence required for a real version |
| --- | --- | --- | --- |
| 1. On a map, the journey looks simple | Endpoints alone do not describe transit experience | Fictional A and B | Agreed origin/destination; reasons for selection without invented passenger accounts |
| 2. Getting there depends on connections | Complete journey has walking, waiting, legs and possible transfers | Solid synthetic path with transfer | Survey route/stop references, current transfer availability, accessible walking paths |
| 3. Fare is only part of cost | Time components matter | Breakdown linked to comparison table | Measured/estimated components, fare units/date if used; no invented fares |
| 4. Wider connection question | Survey contains 68 GTFS route records and 793 stops | Extent caveat; actual network withheld | Reuse terms, coverage limits and defensible selected-network geometry |
| 5. A more direct connection? | Removing a synthetic transfer is an idea to test | Dashed proposed concept, not road alignment | Operator/road suitability and access validation, possible corridor improvement instead |
| 6. Service works? | Interval and delays can reverse model outcomes | Range inputs; complete comparable totals | Waiting practice and capacity; traffic ranges; uncertainty |
| 7. More departures need buses | Fleet follows cycle time and interval | Ceiling calculation, separate spares | Directional runtimes, dwell/recovery, operating constraints |
| 8. What to test? | Specific evidence gaps can guide collaboration | Research/operator/funder invitations | Scope, partners and contact details (currently placeholders) |

## Candidate shortlist — not selected or ranked by need

These names are present in `routes.txt` at the pinned revision. They are candidates for evidence feasibility, **not** findings about unmet demand or difficult journeys.

1. **City Market – UTH Hospital:** an existing direct corridor. Start by testing a service-frequency/reliability improvement rather than inventing an orbital route. Need current route confirmation, departure practice, service window, stops, full access/egress and timing provenance.
2. **Kasupe – Town (Lumumba):** named GTFS route with a corresponding Processed Trips entry and length/fare fields. Promising for checking route–trip–shape joins and estimate provenance. Length alone does not establish travel time; fare units and date need confirmation.
3. **Mutendere – UTH Hospital:** another existing direct corridor to investigate. Compare same endpoints under a service improvement only if field evidence supports it. Do not frame it as missing service.

A cross-city transfer case is deferred until stop/route connectivity and transfer walks are verified; absence from the feed is not enough. Select one candidate after reuse terms and methodology are clarified, then use Python/GeoPandas to link relevant shapes/stops and prepare an explicitly sourced journey JSON and approved GeoJSON. Do not populate a dramatic baseline to fit the story.

## Design direction

Warm paper background, dark green solid routes, rust dashed concepts, serif editorial headings and compact sans-serif evidence labels. Short scenes around a sticky diagram, followed by a focused comparison. No reference-site text, assets, identity, photography or passenger quotations have been copied. Desktop and mobile share the same text and results; mobile uses a smaller sticky diagram.
