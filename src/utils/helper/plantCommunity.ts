// @ts-nocheck
import uuid from 'uuid-v4';

export const resetPlantCommunityId = (plantCommunity) => ({
  ...plantCommunity,
  id: uuid(),
  createdAt: undefined,
  indicatorPlants: plantCommunity.indicatorPlants.map(resetIndicatorPlantId),
  monitoringAreas: plantCommunity.monitoringAreas.map(resetMonitoringAreaId),
  plantCommunityActions: plantCommunity.plantCommunityActions.map(resetPlantCommunityActionId),
});

export const resetIndicatorPlantId = (indicatorPlant) => ({
  ...indicatorPlant,
  createdAt: undefined,
  id: uuid(),
});

export const resetMonitoringAreaId = (monitoringArea) => ({
  ...monitoringArea,
  createdAt: undefined,
  id: uuid(),
});

export const resetPlantCommunityActionId = (plantCommunityAction) => ({
  ...plantCommunityAction,
  createdAt: undefined,
  id: uuid(),
});
