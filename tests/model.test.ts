import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compare } from '../src/lib/model.ts';
const journey = JSON.parse(readFileSync(new URL('../data/fixtures/journey.json', import.meta.url), 'utf8'));
const defaults = journey.defaults;
test('complete journeys include both walks, both bus legs, and transfer walking/waiting exactly once', () => {
  const r = compare(journey, defaults);
  assert.equal(r.baseline.walk, 19); assert.equal(r.baseline.wait, 22); assert.equal(r.baseline.onboard, 42);
  assert.equal(r.baselineTotal, 83); assert.equal(r.proposalTotal, 57.5); assert.equal(r.difference, 25.5);
});
test('frequency changes proposal waiting and fleet, with separate spares', () => {
  const r = compare(journey, { ...defaults, headway: 10, spares: 2 });
  assert.equal(r.proposal.wait, 5); assert.equal(r.roundTrip, 80); assert.equal(r.operatingFleet, 8); assert.equal(r.spares, 2);
  assert.equal(compare(journey, {...defaults, headway: 15}).operatingFleet, 6);
});
test('traffic affects onboard time and round trip, not walks or fixed baseline waits', () => {
  const r = compare(journey, { ...defaults, baselineTraffic: 1.5, proposalTraffic: 2 });
  assert.equal(r.baselineTotal, 104); assert.equal(r.proposalTotal, 89.5); assert.equal(r.roundTrip, 144);
});
test('proposal can be worse and result retains its sign', () => {
  const r = compare(journey, {...defaults, headway: 60, proposalTraffic: 2.5});
  assert.equal(r.proposalTotal, 128); assert.equal(r.difference, -45);
});
test('rejects unusable units and inputs', () => {
  for (const headway of [0, -5, NaN, Infinity]) assert.throws(() => compare(journey, {...defaults, headway}), RangeError);
  assert.throws(() => compare(journey, {...defaults, spares: 1.5}), RangeError);
  assert.throws(() => compare(journey, {...defaults, baselineTraffic: 0}), RangeError);
});
