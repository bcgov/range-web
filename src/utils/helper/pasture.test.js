/* eslint-env jest */
import uuid from 'uuid-v4';
import { resetPastureId } from './pasture';

// Shaped like a GET_PASTURES_FOR_DISTRICT response row: real numeric ids at
// every nesting level. See #1427: the pasture import handler must reset all of
// them, otherwise the save takes the update path against the source plan.
const importedPasture = {
  id: 5724,
  name: 'Caverhill West',
  allowableAum: null,
  graceDays: 3,
  notes: 'Caverhill West pasture ranges in elevation from 1200m-1600m.',
  plantCommunities: [
    {
      id: 2931,
      communityTypeId: 12,
      purposeOfAction: 'maintain',
      notes: 'Current Plant Community: lodgepole pine.',
      url: 'https://example.com/guide.pdf',
      indicatorPlants: [{ id: 101, plantSpeciesId: 32, criteria: 'rangereadiness' }],
      monitoringAreas: [{ id: 201, name: 'MA1' }],
      plantCommunityActions: [{ id: 301, actionTypeId: 1, details: 'Defer' }],
    },
  ],
};

describe('resetPastureId (pasture import, #1427)', () => {
  it('replaces the pasture id and every nested id with UUIDs', () => {
    const result = resetPastureId(importedPasture);

    expect(uuid.isUUID(result.id)).toBe(true);
    const [pc] = result.plantCommunities;
    expect(uuid.isUUID(pc.id)).toBe(true);
    expect(uuid.isUUID(pc.indicatorPlants[0].id)).toBe(true);
    expect(uuid.isUUID(pc.monitoringAreas[0].id)).toBe(true);
    expect(uuid.isUUID(pc.plantCommunityActions[0].id)).toBe(true);
  });

  it('preserves content while resetting ids', () => {
    const result = resetPastureId(importedPasture);

    expect(result.name).toBe(importedPasture.name);
    expect(result.notes).toBe(importedPasture.notes);
    const [pc] = result.plantCommunities;
    expect(pc.communityTypeId).toBe(12);
    expect(pc.notes).toBe('Current Plant Community: lodgepole pine.');
    expect(pc.indicatorPlants[0].plantSpeciesId).toBe(32);
  });

  it('does not mutate the source object', () => {
    resetPastureId(importedPasture);

    expect(importedPasture.id).toBe(5724);
    expect(importedPasture.plantCommunities[0].id).toBe(2931);
  });

  it('handles pastures without plant communities', () => {
    const result = resetPastureId({ id: 1, name: 'Bare', plantCommunities: [] });

    expect(uuid.isUUID(result.id)).toBe(true);
    expect(result.plantCommunities).toEqual([]);
  });
});
