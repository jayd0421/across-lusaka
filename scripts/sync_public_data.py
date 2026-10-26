"""Publish only explicitly selected audit metadata and synthetic fixture.
No recursive copies: raw survey data must never enter the web build.
"""
from pathlib import Path
import shutil
ROOT=Path(__file__).resolve().parents[1]
for source,target in [('data/processed/audit.json','public/data/audit.json'),('data/fixtures/journey.json','public/data/journey-demo.json')]:
    dest=ROOT/target
    dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(ROOT/source,dest)
    print(target)
