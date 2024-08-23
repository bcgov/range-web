import { NOT_PROVIDED } from '../../constants/strings';
import uuid from 'uuid-v4';
import { resetPlantCommunityId } from './plantCommunity';

export const getPastureNames = (pastureIds = [], pasturesMap = {}) => {
  const pastureNames = pastureIds.map((pId) => {
    const pasture = pasturesMap[pId];
    return pasture && pasture.name;
  });
  const { length } = pastureNames;

  switch (length) {
    case 0:
      return NOT_PROVIDED;
    case 1:
    case 2:
      return pastureNames.join(' and ');
    default:
      return `${pastureNames.slice(0, length - 1).join(', ')}, and ${pastureNames[length - 1]}`;
  }
};

export const resetPastureId = (pasture) => ({
  ...pasture,
  id: uuid(),
  createdAt: undefined,
  plantCommunities: pasture.plantCommunities.map(resetPlantCommunityId),
});

export const generatePasture = (name = '') => ({
  name,
  allowableAum: '',
  graceDays: 1,
  pldPercent: 0,
  notes: '',
  plantCommunities: [],
  id: uuid(),
});
