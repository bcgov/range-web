import { PlantCommunity } from './plantCommunity';

/**
 * A named grazing area within a Plan.
 */
export interface Pasture {
  id: number;
  name: string;
  allowableAum: number | null;
  graceDays: number | null;
  pldPercent: number | null;
  notes: string | null;
  planId: number;
  canonicalId?: number | null;
  createdAt?: string;
  plantCommunities: PlantCommunity[];
}
