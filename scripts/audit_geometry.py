"""Validate the five selected GeoJSON layers; output aggregate statistics only.
Input: ignored raw files. Output: data/processed/geometry-audit.json.
Uses GeoPandas for CRS, validity and extents. Never reprojects or edits raw data.
"""
from pathlib import Path
import json
import geopandas as gpd
ROOT = Path(__file__).resolve().parents[1]
result = {}
for path in sorted((ROOT/'data/raw/lusaka').glob('*.geojson')):
    frame = gpd.read_file(path)
    result[path.name] = {'features':len(frame),'crs':str(frame.crs),'invalid':int((~frame.geometry.is_valid).sum()),'empty':int(frame.geometry.is_empty.sum()),'bounds_lon_lat':frame.total_bounds.tolist()}
(ROOT/'data/processed/geometry-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
