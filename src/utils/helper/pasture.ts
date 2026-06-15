import { NOT_PROVIDED } from '../../constants/strings';
import uuid from 'uuid-v4';
import { resetPlantCommunityId } from './plantCommunity';

interface PastureLike {
  id?: any;
  name?: string;
  createdAt?: any;
  plantCommunities: any[];
  [key: string]: any;
}

export const getPastureNames = (
  pastureIds: (string | number)[] = [],
  pasturesMap: Record<string, any> = {},
): string => {
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

export const resetPastureId = (pasture: PastureLike): any => ({
  ...pasture,
  id: uuid(),
  createdAt: undefined,
  plantCommunities: pasture.plantCommunities.map(resetPlantCommunityId),
});

interface GeneratedPasture {
  name: string;
  allowableAum: string;
  graceDays: number;
  pldPercent: number;
  notes: string;
  plantCommunities: any[];
  id: string;
}

export const generatePasture = (name = ''): GeneratedPasture => ({
  name,
  allowableAum: '',
  graceDays: 1,
  pldPercent: 0,
  notes: '',
  plantCommunities: [],
  id: uuid(),
});
