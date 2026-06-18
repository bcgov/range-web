import uuid from 'uuid-v4';

export interface PlantCommunityLike {
  id?: string | number;
  createdAt?: string;
  indicatorPlants: Record<string, unknown>[];
  monitoringAreas: Record<string, unknown>[];
  plantCommunityActions: Record<string, unknown>[];
}

interface IndicatorPlantLike {
  id?: string | number;
  createdAt?: string;
}

interface MonitoringAreaLike {
  id?: string | number;
  createdAt?: string;
}

interface PlantCommunityActionLike {
  id?: string | number;
  createdAt?: string;
}

export const resetPlantCommunityId = (plantCommunity: Record<string, unknown>): Record<string, unknown> => ({
  ...plantCommunity,
  id: uuid(),
  createdAt: undefined,
  indicatorPlants: (plantCommunity.indicatorPlants as IndicatorPlantLike[]).map(resetIndicatorPlantId),
  monitoringAreas: (plantCommunity.monitoringAreas as MonitoringAreaLike[]).map(resetMonitoringAreaId),
  plantCommunityActions: (plantCommunity.plantCommunityActions as PlantCommunityActionLike[]).map(
    resetPlantCommunityActionId,
  ),
});

export const resetIndicatorPlantId = (indicatorPlant: IndicatorPlantLike): Record<string, unknown> => ({
  ...indicatorPlant,
  createdAt: undefined,
  id: uuid(),
});

export const resetMonitoringAreaId = (monitoringArea: MonitoringAreaLike): Record<string, unknown> => ({
  ...monitoringArea,
  createdAt: undefined,
  id: uuid(),
});

export const resetPlantCommunityActionId = (
  plantCommunityAction: PlantCommunityActionLike,
): Record<string, unknown> => ({
  ...plantCommunityAction,
  createdAt: undefined,
  id: uuid(),
});
