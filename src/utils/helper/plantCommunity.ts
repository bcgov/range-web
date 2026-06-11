import uuid from 'uuid-v4';

interface PlantCommunityLike {
  id?: any;
  createdAt?: any;
  indicatorPlants: any[];
  monitoringAreas: any[];
  plantCommunityActions: any[];
  [key: string]: any;
}

interface IndicatorPlantLike {
  id?: any;
  createdAt?: any;
  [key: string]: any;
}

interface MonitoringAreaLike {
  id?: any;
  createdAt?: any;
  [key: string]: any;
}

interface PlantCommunityActionLike {
  id?: any;
  createdAt?: any;
  [key: string]: any;
}

export const resetPlantCommunityId = (plantCommunity: PlantCommunityLike): any => ({
  ...plantCommunity,
  id: uuid(),
  createdAt: undefined,
  indicatorPlants: plantCommunity.indicatorPlants.map(resetIndicatorPlantId),
  monitoringAreas: plantCommunity.monitoringAreas.map(resetMonitoringAreaId),
  plantCommunityActions: plantCommunity.plantCommunityActions.map(resetPlantCommunityActionId),
});

export const resetIndicatorPlantId = (indicatorPlant: IndicatorPlantLike): any => ({
  ...indicatorPlant,
  createdAt: undefined,
  id: uuid(),
});

export const resetMonitoringAreaId = (monitoringArea: MonitoringAreaLike): any => ({
  ...monitoringArea,
  createdAt: undefined,
  id: uuid(),
});

export const resetPlantCommunityActionId = (plantCommunityAction: PlantCommunityActionLike): any => ({
  ...plantCommunityAction,
  createdAt: undefined,
  id: uuid(),
});
