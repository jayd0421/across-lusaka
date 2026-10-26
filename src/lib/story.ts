import fixture from '../../data/fixtures/journey.json';
import { compare } from './model';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const form = $<HTMLFormElement>('scenario-form');
const headway = $<HTMLInputElement>('headway');
const baselineTraffic = $<HTMLInputElement>('baseline-traffic');
const proposalTraffic = $<HTMLInputElement>('proposal-traffic');
const spares = $<HTMLSelectElement>('spares');
const format = (n: number) => n.toFixed(1);
function update() {
  const input = { headway: +headway.value, baselineTraffic: +baselineTraffic.value, proposalTraffic: +proposalTraffic.value, spares: +spares.value };
  const r = compare(fixture, input);
  $('headway-value').textContent = `${input.headway} min`;
  $('baseline-traffic-value').textContent = `${format(input.baselineTraffic)}×`;
  $('proposal-traffic-value').textContent = `${format(input.proposalTraffic)}×`;
  $('baseline-total').textContent = $('baseline-table-total').textContent = format(r.baselineTotal);
  $('proposal-total').textContent = $('proposal-table-total').textContent = format(r.proposalTotal);
  $('baseline-onboard').textContent = format(r.baseline.onboard);
  $('proposal-onboard').textContent = format(r.proposal.onboard);
  $('initial-wait').textContent = format(r.proposal.wait);
  const summary = $('comparison-summary');
  const strong = document.createElement('strong');
  strong.textContent = r.difference === 0 ? 'Equal journey times' : `${format(Math.abs(r.difference))} minutes ${r.difference > 0 ? 'less' : 'more'}`;
  summary.replaceChildren(strong, document.createTextNode(' with the proposed concept.'));
  const max = Math.max(r.baselineTotal, r.proposalTotal);
  for (const option of ['baseline', 'proposal'] as const) {
    const bar = $(`${option}-bar`);
    bar.replaceChildren(...(['walk', 'wait', 'onboard'] as const).map(key => {
      const piece = document.createElement('span');
      piece.className = key;
      piece.style.width = `${r[option][key] / max * 100}%`;
      return piece;
    }));
  }
  $('fleet-count').textContent = String(r.operatingFleet);
  $('spare-count').textContent = String(r.spares);
  $('round-trip').textContent = format(r.roundTrip);
  $('fleet-headway').textContent = String(input.headway);
}
form.addEventListener('input', update);
form.addEventListener('reset', () => requestAnimationFrame(update));
update();
document.body.classList.add('js');

// Load the mapping engine only when the story approaches the viewport.
const mapLoader = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  mapLoader.disconnect();
  import('./map').catch(() => { /* The static diagram remains usable. */ });
}, { rootMargin: '500px' });
mapLoader.observe($('story-map'));
