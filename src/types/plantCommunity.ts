/**
 * An indicator plant within a plant community — used to track rangeland health.
 */
export interface IndicatorPlant {
  id: number;
  plantSpeciesId: number | null;
  value: number | null;
  name: string | null;
  criteria: string;
}

/**
 * A monitoring area within a plant community — a geographic point for rangeland health assessment.
 */
export interface MonitoringArea {
  id: number;
  name: string | null;
  latitude: number | null;
  longitude: number | null;
  location: string | null;
  rangelandHealthId: number | null;
  purposeTypeIds: number[];
  purposes?: MonitoringAreaPurpose[];
}

export interface MonitoringAreaPurpose {
  id: number;
  name: string;
}

/**
 * An action to be taken on a plant community.
 */
export interface PlantCommunityAction {
  id: number;
  actionTypeId: number | null;
  name: string | null;
  details: string | null;
  noGrazeStartMonth?: number | null;
  noGrazeStartDay?: number | null;
  noGrazeEndMonth?: number | null;
  noGrazeEndDay?: number | null;
}

/**
 * A vegetation community within a Pasture.
 */
export interface PlantCommunity {
  id: number;
  communityTypeId: number;
  elevationId: number | null;
  pastureId: number;
  purposeOfAction: string;
  name: string | null;
  aspect: string | null;
  url: string | null;
  notes: string | null;
  rangeReadinessDay: number | null;
  rangeReadinessMonth: number | null;
  rangeReadinessNote: string | null;
  approved: boolean;
  shrubUse: number | null;
  canonicalId: number | null;
  createdAt?: string;
  elevation: { id: number; name: string; active: boolean } | null;
  communityType?: { id: number; name: string; active: boolean };
  indicatorPlants: IndicatorPlant[];
  monitoringAreas: MonitoringArea[];
  plantCommunityActions: PlantCommunityAction[];
}
