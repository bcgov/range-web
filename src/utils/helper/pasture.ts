import uuid from 'uuid-v4';
import { PlantCommunity } from '../../types';
import { resetPlantCommunityId } from './plantCommunity';

interface PastureLike {
  id?: string | number;
  name?: string;
  createdAt?: string;
  plantCommunities: Record<string, unknown>[];
}

export const resetPastureId = (pasture: PastureLike): PastureLike => ({
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
  plantCommunities: PlantCommunity[];
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
