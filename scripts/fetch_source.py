"""Download pinned audit inputs over verified HTTPS, checking recorded SHA-256.
Does not overwrite changed local files. Raw survey data stays ignored, not public.
"""
from pathlib import Path
import argparse
import hashlib
import json
import urllib.parse
import urllib.request
ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT/'data/source-manifest.json').read_text())
parser = argparse.ArgumentParser()
parser.add_argument('--destination', type=Path, default=ROOT/'data/raw/lusaka')
raw = parser.parse_args().destination
raw.mkdir(parents=True, exist_ok=True)
base = f"https://gitlab.com/api/v4/projects/{manifest['project_id']}/repository/"
for entry in manifest['files']:
    dest = raw/entry['local_name']
    if dest.exists():
        if hashlib.sha256(dest.read_bytes()).hexdigest() != entry['sha256']:
            raise SystemExit(f'Refusing to overwrite changed file: {dest}')
        print(f"Verified existing {dest.name}")
        continue
    if 'remote_path' in entry:
        url = base+'files/'+urllib.parse.quote(entry['remote_path'],safe='')+'/raw?ref='+manifest['commit']
    elif entry['local_name']=='tree.json':
        url = base+entry['api_endpoint']+'&ref='+manifest['commit']
    else:
        url = base+entry['api_endpoint']+manifest['commit']
    payload = urllib.request.urlopen(url, timeout=60).read()
    if hashlib.sha256(payload).hexdigest()!=entry['sha256']:
        raise SystemExit(f"Checksum mismatch for {dest.name}; nothing written. Investigate source, do not bypass.")
    dest.write_bytes(payload)
    print(f'Downloaded and verified {dest.name}')
