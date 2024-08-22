import moment from 'moment';
import uuid from 'uuid-v4';
import { NOT_PROVIDED } from '../../constants/strings';

export const getRangeReadinessMonthAndDate = (month, day) => {
  let readinessMonthAndDate;
  if (month && day) {
    readinessMonthAndDate = moment()
      .set('year', new Date().getFullYear())
      .set('month', month - 1)
      .set('date', day)
      .format('MMMM D');
  }

  return readinessMonthAndDate;
};

export const getMonitoringAreaPurposes = (purposes, otherPurpose) => {
  if (!purposes || !purposes.length) {
    return NOT_PROVIDED;
  }
  const purposeNames = purposes.map((purp) => purp.purposeType && purp.purposeType.name);
  if (otherPurpose) {
    purposeNames.push(otherPurpose);
  }

  const { length } = purposeNames;
  switch (length) {
    case 0:
      return NOT_PROVIDED;
    case 1:
    case 2:
      return purposeNames.join(' and ');
    default:
      return `${purposeNames.slice(0, length - 1).join(', ')}, and ${purposeNames[length - 1]}`;
  }
};

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
