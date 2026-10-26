export interface Journey {
  baseline: { accessWalk: number; egressWalk: number; initialWait: number; transferWalk: number; transferWait: number; onboardLegs: number[] };
  proposal: { accessWalk: number; egressWalk: number; onboardLegs: number[]; recoveryPerRoundTrip: number };
}
export interface Scenario { headway: number; baselineTraffic: number; proposalTraffic: number; spares: number }
export function compare(journey: Journey, scenario: Scenario) {
  const { headway, baselineTraffic, proposalTraffic, spares } = scenario;
  const b = journey.baseline, p = journey.proposal;
  const times = [b.accessWalk, b.egressWalk, b.initialWait, b.transferWalk, b.transferWait, ...b.onboardLegs, p.accessWalk, p.egressWalk, ...p.onboardLegs, p.recoveryPerRoundTrip];
  if (times.some(n => !Number.isFinite(n) || n < 0) || !Number.isFinite(headway) || headway <= 0 || !Number.isFinite(baselineTraffic) || baselineTraffic <= 0 || !Number.isFinite(proposalTraffic) || proposalTraffic <= 0 || !Number.isInteger(spares) || spares < 0) throw new RangeError('Times must be nonnegative; headways and traffic positive; spares a nonnegative integer.');
  const baseline = { walk: b.accessWalk + b.egressWalk + b.transferWalk, wait: b.initialWait + b.transferWait, onboard: b.onboardLegs.reduce((a, n) => a + n, 0) * baselineTraffic };
  const proposal = { walk: p.accessWalk + p.egressWalk, wait: headway / 2, onboard: p.onboardLegs.reduce((a, n) => a + n, 0) * proposalTraffic };
  const baselineTotal = baseline.walk + baseline.wait + baseline.onboard;
  const proposalTotal = proposal.walk + proposal.wait + proposal.onboard;
  const roundTrip = 2 * proposal.onboard + p.recoveryPerRoundTrip;
  return { baseline, proposal, baselineTotal, proposalTotal, difference: baselineTotal - proposalTotal, roundTrip, operatingFleet: Math.ceil(roundTrip / headway), spares };
}
