import { REFERENCE_KEY } from '../../constants/variables';
import {
  calcDateDiff,
  calcTotalAUMs,
  roundTo1Decimal,
  calcCrownAUMs,
  calcPldAUMs,
} from '../calculation';
import moment from 'moment';
import uuid from 'uuid-v4';

export const populateGrazingScheduleFields = (
  grazingSchedule,
  plan,
  references,
) => {
  const { pastures = [] } = plan;
  const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE] || [];

  return {
    ...grazingSchedule,
    grazingScheduleEntries: grazingSchedule.grazingScheduleEntries.map(
      (entry) => {
        const pasture = pastures.find((p) => p.id === entry.pastureId);
        const livestockType = livestockTypes.find(
          (lt) => lt.id === entry.livestockTypeId,
        );

        const pldPercent = pasture && pasture.pldPercent;
        const auFactor = livestockType && livestockType.auFactor;

        const days = calcDateDiff(entry.dateOut, entry.dateIn, false);
        const totalAUMs = calcTotalAUMs(entry.livestockCount, days, auFactor);
        const pldAUMs = roundTo1Decimal(calcPldAUMs(totalAUMs, pldPercent));
        const crownAUMs = roundTo1Decimal(calcCrownAUMs(totalAUMs, pldAUMs));

        return {
          ...entry,
          pasture,
          livestockType,
          days,
          pldAUMs,
          crownAUMs,
          createdAtDate: moment(entry.createdAt),
        };
      },
    ),
  };
};

export const resetGrazingScheduleEntryId = (schedule) => ({
  ...schedule,
  id: uuid(),
  createdAt: undefined,
});
