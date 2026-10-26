"""Audit unchanged local survey exports; never publish source geometries.
Input: data/raw/lusaka. Output: data/processed/audit.json (aggregate metadata).
Run: python scripts/audit_data.py. See docs/DATA_AUDIT.md for interpretation.
"""
from pathlib import Path
import csv
import io
import json
import hashlib
import zipfile
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'data/raw/lusaka'

def seconds(value):
    h, m, s = map(int, value.split(':'))
    if min(h, m, s) < 0 or m > 59 or s > 59:
        raise ValueError(value)
    return h * 3600 + m * 60 + s

def audit():
    with zipfile.ZipFile(RAW / 'gtfs.zip') as archive:
        tables = {name: list(csv.DictReader(io.StringIO(archive.read(name).decode('utf-8-sig')))) for name in archive.namelist() if name.endswith('.txt')}
    ids = {name: {r[key] for r in tables[name]} for name, key in [('routes.txt', 'route_id'), ('stops.txt', 'stop_id'), ('trips.txt', 'trip_id'), ('calendar.txt', 'service_id'), ('shapes.txt', 'shape_id'), ('agency.txt', 'agency_id')]}
    refs = [('trips.txt','route_id','routes.txt'), ('trips.txt','service_id','calendar.txt'), ('trips.txt','shape_id','shapes.txt'), ('routes.txt','agency_id','agency.txt'), ('stop_times.txt','trip_id','trips.txt'), ('stop_times.txt','stop_id','stops.txt'), ('frequencies.txt','trip_id','trips.txt')]
    checks = {f'{a}.{field} → {b}': sum(r[field] not in ids[b] for r in tables[a]) for a,field,b in refs}
    groups = {}
    for row in tables['stop_times.txt']:
        groups.setdefault(row['trip_id'], []).append(row)
    backward = 0
    duplicate_sequences = 0
    for rows in groups.values():
        rows.sort(key=lambda r:int(r['stop_sequence']))
        duplicate_sequences += len(rows) - len({r['stop_sequence'] for r in rows})
        previous = -1
        for row in rows:
            arrival, departure = seconds(row['arrival_time']), seconds(row['departure_time'])
            backward += int(arrival < previous or departure < arrival)
            previous = departure
    stops = tables['stops.txt']
    geo = {}
    for path in sorted(RAW.glob('*.geojson')):
        source = json.loads(path.read_text())
        features = source['features']
        geo[path.name] = {'features': len(features), 'crs': source.get('crs'), 'geometry_types': dict(Counter((f.get('geometry') or {}).get('type', 'null') for f in features)), 'null_geometries': sum(f.get('geometry') is None for f in features), 'null_property_values': sum(v is None for f in features for v in f['properties'].values()), 'fields': sorted({k for f in features for k in f['properties']})}
    tree = json.loads((RAW/'tree.json').read_text())
    files = [r['path'] for r in tree if r['type']=='blob']
    dates = sorted(f['properties']['departed_at'] for f in json.loads((RAW/'frequency Instance Observations.geojson').read_text())['features'])
    result = {
        'audited_at': '2026-10-26',
        'source_url': 'https://gitlab.com/digitaltransport/data/africa/lusaka',
        'source_commit': json.loads((RAW/'commit.json').read_text())['id'],
        'reuse_status': 'No explicit licence located in repository inventory or README; permission unresolved. Do not redistribute source data or geometry.',
        'inventory': files,
        'gtfs': {name:{'rows':len(rows),'fields':list(rows[0]) if rows else [],'blank_cells':sum(v=='' for r in rows for v in r.values())} for name,rows in tables.items()},
        'feed_info': tables['feed_info.txt'], 'calendar': tables['calendar.txt'],
        'quality': {'broken_references': checks, 'duplicate_ids': {name:len(tables[name])-len(ids[name]) for name in ['routes.txt','stops.txt','trips.txt','agency.txt']}, 'backward_stop_times':backward,'duplicate_stop_sequences':duplicate_sequences,'invalid_stop_coordinates':sum(not (-90 <= float(r['stop_lat']) <=90 and -180 <= float(r['stop_lon']) <=180) for r in stops),'stop_bounds_lon_lat':[min(float(r['stop_lon']) for r in stops),min(float(r['stop_lat']) for r in stops),max(float(r['stop_lon']) for r in stops),max(float(r['stop_lat']) for r in stops)],'timepoint_values':dict(Counter(r['timepoint'] for r in tables['stop_times.txt']))},
        'frequency': {'min_headway_seconds':min(int(r['headway_secs']) for r in tables['frequencies.txt']), 'max_headway_seconds':max(int(r['headway_secs']) for r in tables['frequencies.txt']), 'nonpositive_headways':sum(int(r['headway_secs'])<=0 for r in tables['frequencies.txt']), 'invalid_windows':sum(seconds(r['end_time'])<=seconds(r['start_time']) for r in tables['frequencies.txt']), 'exact_times_present':any('exact_times' in r for r in tables['frequencies.txt'])},
        'observation_timestamp_range': [dates[0], dates[-1]], 'geojson':geo,
        'source_sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(RAW.iterdir()) if p.is_file() and p.name not in ['project.json']}
    }
    output = ROOT/'data/processed/audit.json'
    output.write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps({k:result[k] for k in ['source_commit','quality','frequency','observation_timestamp_range']},indent=2))
    return result

if __name__ == '__main__':
    audit()
