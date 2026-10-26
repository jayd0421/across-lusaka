# First data audit

Audit date: 26 October 2026. This is a historical surveyed baseline, not a guaranteed description of services operating today.

## Source and access

Repository: https://gitlab.com/digitaltransport/data/africa/lusaka/

Pinned commit: `e0c2a436f1bc2b85031670161a1b53eceeb951a1` (main at inspection). GitLab project ID 55898261. Public API and file downloads succeeded over verified HTTPS without credentials. Recursive tree returned 83 entries; a second page returned zero. There are 71 files and 12 directories.

The supplied reference sites `https://greentogrey.eu/` and `https://lumbadigital.com/` returned HTTP 403 to curl in this cloud environment. Their content/design was not inspected or copied. The story progression follows the user's supplied storyboard. The business domain is used only as the supplied outbound link; no contact details or brand assets were inferred.

Source README credits Smart Solutech and Transport for Cairo, under a WRI-led consortium, for “Low-Carbon Transport Futures in Zambia,” sponsored by Climate Compatible Growth and funded by the Foreign, Commonwealth and Development Office.

## Rights

No explicit data licence was found in the complete repository file inventory, source README or inspected dataset-index workbook. GitLab project metadata returned no licence information. Public accessibility does not settle reuse rights. This is an unresolved permission question, not a claim that reuse is forbidden. The code repository's MIT licence does not extend to source data.

**Release rule:** keep downloaded raw data ignored and outside `public/`; do not redistribute survey geometry, original transit maps or detailed survey records until an applicable licence or written permission is established. The site uses an original synthetic schematic and aggregate factual audit findings only. Contact data producers through their published channels to establish applicable licence, attribution and derivative-work terms; no messages have been sent.

## Inventory

Full path inventory: `data/processed/audit.json`. Source fingerprints: `data/source-manifest.json`.

| Files | Inventory / inspected scope |
| --- | --- |
| `Datasets/gtfs.zip` | Downloaded, all nine tables inspected |
| `Datasets/Index of Datasets.xlsx` | Downloaded, single sheet inspected with openpyxl |
| Identification | Identified Routes and Terminals GeoJSON inspected; shapefile equivalents inventoried |
| Onboard | Processed Trips inspected; Raw Trips, Raw stops, Processed stops, Track Points inventoried only |
| Frequency | Frequency Instances and Instance Observations inspected |
| Section Counts | GeoJSON/shapefile inventoried only |
| Grid Analysis | H3 resolution-8 GeoJSON/shapefile inventoried only; demand/emissions inputs not validated |
| Lusaka-Transit-Map | JPG and PDF inventoried; not copied into public site |

Formats: 11 GeoJSON, 11 each of `.cpg/.dbf/.prj/.shp/.shx`, one XLSX, one ZIP, one JPG, one PDF, one README. Not all spatial layers have been quality-audited. No whole-city completeness or ridership claims are justified.

## GTFS findings

| Table | Rows | Notes |
| --- | ---: | --- |
| agency | 3 | Vehicle classes; not assumed to identify individual operating companies |
| routes | 68 | Survey/feed route records, not necessarily 68 distinct current corridors |
| stops | 793 | Named stops; index says manually digitised from regular boarding/alighting |
| trips | 408 | Templates across time windows, not counts of daily observed departures |
| stop_times | 9,219 | Every row has `timepoint=0` (approximate); not a timetable guarantee |
| frequencies | 408 | Headways 29–3,600 seconds; `exact_times` absent, GTFS default is frequency-based |
| shapes | 13,431 | Shape vertices, not trip counts |
| calendar | 1 | Daily service flag, 2023-09-01 through 2024-12-30 |
| feed_info | 1 | DigitalTransport4Africa publisher; same start/end dates |

No `calendar_dates`, fares tables or explicit stop accessibility fields appear in this archive. No fare conclusion should be inferred from their absence. Processed Trips does contain a `fare` field, but units, context and present relevance have not been established.

The dataset index says GTFS is based on cleaned survey data and uses raw data for travel-time and headway estimates. This gives provenance as **survey-derived estimates**, not directly observed exact stop times. The exact estimation and aggregation procedure still needs documentation from producers. Frequency instance summaries contain `avg_headway_sec`, observation duration, count and terminal names. Do not treat these as regular service commitments or apply half-headway waiting automatically.

## Dates and spatial coverage

README describes collection in July 2023. The 829 departure-observation timestamps actually span **2023-07-13T13:50:24.131Z to 2023-09-21T15:13:49.112Z**. Frequency instance creation timestamps also extend beyond July. Distinguish described project period, actual record timestamps, export dates and GTFS validity.

Selected GeoJSON declares CRS84 (longitude, latitude); GeoPandas reads EPSG:4326. Stop bounds: 28.132587–28.423452 longitude, −15.569788–−15.284176 latitude. This extent is not proof of complete service coverage. Any future distances should use a suitable projected CRS, e.g. EPSG:32735 (UTM 35S), after checking applicability; never measure degrees as metres.

| Inspected layer | Features | Geometry | Missing/invalid/empty geometry |
| --- | ---: | --- | --- |
| Identified Routes | 67 | Point: bus queue positions, **not route lines** | 0 / 0 / 0 |
| Terminals | 50 | MultiPolygon | 0 / 0 / 0 |
| Processed Trips | 136 | LineString | 0 / 0 / 0 |
| Frequency Instances | 216 | Point | 0 / 0 / 0 |
| Frequency Instance Observations | 829 | Point | 0 / 0 / 0 |

The five inspected layers contain no null property values. This does not validate semantics, sentinel values, positional accuracy or every layer. The 67 identification points and 68 GTFS routes are distinct representations with different counts; no automatic one-to-one match has been established. Index metadata describes 216 **hours** of frequency surveys; the GeoJSON has 216 **features**. Do not conflate these units without checking.

## Automated consistency checks

`python scripts/audit_data.py` checks all referenced route, agency, service, shape, stop and trip keys: zero broken references. Route/stop/trip/agency IDs: zero duplicates. Stop coordinates: zero out of valid longitude/latitude ranges. Ordered stop times: zero backward times, zero repeated stop sequences. Frequency windows: zero reversed/empty windows, zero nonpositive headways. These are internal checks, not field validation or a full GTFS-validator certification.

` .venv/bin/python scripts/audit_geometry.py` uses GeoPandas to check the five downloaded GeoJSON layers: no invalid or empty geometries. Aggregate results and extents are in `data/processed/geometry-audit.json`.

## Reproduce and verify

See README for environment setup. `scripts/fetch_source.py` downloads eight pinned source files plus tree and commit metadata, verifies SHA-256, and refuses changed existing files. Inputs remain unchanged in ignored `data/raw/lusaka`. A fresh temporary download was compared against all recorded checksums. Audit commands output only aggregate metadata. `scripts/sync_public_data.py` explicitly copies two approved files; it never recursively copies raw data.

## What is needed next

1. An explicit applicable reuse licence or written permission, including attribution/derivative conditions.
2. Producer notes on GTFS time/headway estimation, frequency windows, sampling and fare units.
3. Local verification of present-day service, waiting practices, boarding capacity, transfer locations, walking paths and constraints.
4. Select and field-check one origin/destination with consistent door-to-door boundaries. Shortlist in STORYBOARD.

None of these questions prevents testing the interface with labelled fixtures. They do prevent presenting a real validated journey comparison or publishing the surveyed network geometry in this version.
