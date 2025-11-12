import { REFERENCE_KEY } from '../../constants/variables';
import { calcDateDiff, calcTotalAUMs, round, calcCrownAUMs, calcPldAUMs } from '../calculation';
import moment from 'moment';
import uuid from 'uuid-v4';

export const populateGrazingScheduleFields = (schedule, plan, references) => {
  const { pastures = [] } = plan;
  const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE] || [];

  return {
    ...schedule,
    scheduleEntries: schedule.scheduleEntries.map((entry) => {
      const pasture = pastures.find((p) => p.id === entry.pastureId);
      const livestockType = livestockTypes.find((lt) => lt.id === entry.livestockTypeId);

      const pldPercent = pasture && pasture.pldPercent;
      const auFactor = livestockType && livestockType.auFactor;

      const days = calcDateDiff(entry.dateOut, entry.dateIn, false);
      const totalAUMs = calcTotalAUMs(entry.livestockCount, days, auFactor);
      const pldAUMs = round(calcPldAUMs(totalAUMs, pldPercent), 0);
      const crownAUMDecimal = calcCrownAUMs(totalAUMs, pldAUMs);
      const crownAUMs = crownAUMDecimal > 0 && crownAUMDecimal < 1 ? 1 : round(crownAUMDecimal, 0);

      return {
        ...entry,
        pasture,
        livestockType,
        days,
        pldAUMs,
        crownAUMs,
        createdAtDate: moment(entry.createdAt),
      };
    }),
  };
};

export const populateHayCuttingScheduleFields = (schedule, plan) => {
  const { pastures = [] } = plan;

  return {
    ...schedule,
    scheduleEntries: schedule.scheduleEntries.map((entry) => {
      const pasture = pastures.find((p) => p.id === entry.pastureId);
      return {
        ...entry,
        pasture,
        createdAtDate: moment(entry.createdAt),
      };
    }),
  };
};

export const resetScheduleEntryId = (schedule) => ({
  ...schedule,
  id: uuid(),
  createdAt: undefined,
});
