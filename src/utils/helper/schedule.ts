import { REFERENCE_KEY } from '../../constants/variables';
import { calcDateDiff, calcTotalAUMs, round, calcCrownAUMs, calcPldAUMs } from '../calculation';
import moment from 'moment';
import uuid from 'uuid-v4';

interface ScheduleEntryLike {
  pastureId?: number | null;
  livestockTypeId?: number | null;
  livestockCount?: number | null;
  dateIn?: string | null;
  dateOut?: string | null;
  createdAt?: string;
  [key: string]: any;
}

interface ScheduleLike {
  scheduleEntries: ScheduleEntryLike[];
  [key: string]: any;
}

interface PlanLike {
  pastures?: any[];
  [key: string]: any;
}

interface LivestockTypeLike {
  id: number;
  auFactor?: number;
  [key: string]: any;
}

interface ReferencesLike {
  [key: string]: any;
}

export const populateGrazingScheduleFields = (schedule: ScheduleLike, plan: PlanLike, references: ReferencesLike): any => {
  const { pastures = [] } = plan;
  const livestockTypes: LivestockTypeLike[] = references[REFERENCE_KEY.LIVESTOCK_TYPE] || [];

  return {
    ...schedule,
    scheduleEntries: schedule.scheduleEntries.map((entry) => {
      const pasture = pastures.find((p: any) => p.id === entry.pastureId);
      const livestockType = livestockTypes.find((lt) => lt.id === entry.livestockTypeId);

      const pldPercent = pasture && pasture.pldPercent;
      const auFactor = livestockType && livestockType.auFactor;

      const days = calcDateDiff(entry.dateOut, entry.dateIn, false) as number;
      const totalAUMs = calcTotalAUMs(entry.livestockCount || 0, days, auFactor);
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

export const populateHayCuttingScheduleFields = (schedule: ScheduleLike, plan: PlanLike): any => {
  const { pastures = [] } = plan;

  return {
    ...schedule,
    scheduleEntries: schedule.scheduleEntries.map((entry) => {
      const pasture = pastures.find((p: any) => p.id === entry.pastureId);
      return {
        ...entry,
        pasture,
        createdAtDate: moment(entry.createdAt),
      };
    }),
  };
};

export const resetScheduleEntryId = (schedule: { id?: any; createdAt?: any; [key: string]: any }): any => ({
  ...schedule,
  id: uuid(),
  createdAt: undefined,
});
