import { REFERENCE_KEY } from '../../constants/variables';
import { calcDateDiff, calcTotalAUMs, round, calcCrownAUMs, calcPldAUMs } from '../calculation';
import moment from 'moment';
import uuid from 'uuid-v4';
import { Pasture } from '../../types';

interface ScheduleEntryLike {
  pastureId?: number | null;
  livestockTypeId?: number | null;
  livestockCount?: number | null;
  dateIn?: string | null;
  dateOut?: string | null;
  createdAt?: string;
}

interface ScheduleLike {
  scheduleEntries: ScheduleEntryLike[];
}

interface PlanLike {
  pastures?: Pasture[];
}

interface LivestockTypeLike {
  id: number;
  auFactor?: number;
}

interface ReferencesLike {
  [key: string]: unknown[];
}

export const populateGrazingScheduleFields = (
  schedule: ScheduleLike,
  plan: PlanLike,
  references: ReferencesLike,
): Record<string, unknown> => {
  const { pastures = [] } = plan;
  const livestockTypes: LivestockTypeLike[] = (references[REFERENCE_KEY.LIVESTOCK_TYPE] || []) as LivestockTypeLike[];

  return {
    ...schedule,
    scheduleEntries: schedule.scheduleEntries.map((entry) => {
      const pasture = pastures.find((p: Pasture) => p.id === entry.pastureId);
      const livestockType = livestockTypes.find((lt) => lt.id === entry.livestockTypeId);

      const pldPercent = (pasture && pasture.pldPercent) ?? undefined;
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

export const populateHayCuttingScheduleFields = (schedule: ScheduleLike, plan: PlanLike): Record<string, unknown> => {
  const { pastures = [] } = plan;

  return {
    ...schedule,
    scheduleEntries: schedule.scheduleEntries.map((entry) => {
      const pasture = pastures.find((p: Pasture) => p.id === entry.pastureId);
      return {
        ...entry,
        pasture,
        createdAtDate: moment(entry.createdAt),
      };
    }),
  };
};

export const resetScheduleEntryId = (schedule: ScheduleEntryLike): Record<string, unknown> => ({
  ...schedule,
  id: uuid(),
  createdAt: undefined,
});
