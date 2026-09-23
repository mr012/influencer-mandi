import test from 'node:test';
import assert from 'node:assert/strict';
import { filterDiscovery } from '../src/utils/discoveryFilters.js';
import { CAMPAIGNS } from '../src/mocks/campaigns.js';
import { CREATORS } from '../src/mocks/creators.js';

test('empty filters keep all campaigns', () => {
  assert.deepEqual(filterDiscovery(CAMPAIGNS, 'creator'), CAMPAIGNS);
});
test('locations and categories use OR internally and AND together', () => {
  assert.deepEqual(filterDiscovery(CAMPAIGNS, 'creator', {
    city: ['Mumbai', 'Remote'], category: ['Food & beverage', 'Fashion'],
  }).map(item => item.id), ['c1', 'c2', 'c6']);
});
test('Delhi NCR matches Delhi without changing stored data', () => {
  assert.deepEqual(filterDiscovery(CAMPAIGNS, 'creator', { city: ['Delhi'] }).map(item => item.id), ['c5']);
  assert.equal(CAMPAIGNS.find(item => item.id === 'c5').loc, 'Delhi NCR');
});
test('brands filter creators by content tags', () => {
  const matches = filterDiscovery(CREATORS, 'brand', { category: ['Cafe reviews', 'Gadgets'] });
  assert.deepEqual(matches.map(item => item.id), ['u1', 'u2']);
});
test('no match returns an empty list', () => {
  assert.deepEqual(filterDiscovery(CAMPAIGNS, 'creator', { city: ['Mumbai'], category: ['Tech'] }), []);
});
