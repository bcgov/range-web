/* eslint-env jest */
import { calcEntryAUMs, calcCrownTotalAUMs } from './grazingSchedule';

// Mirrors #1430: while a grazing schedule row is being typed, its
// `livestockCount` is a free-text Formik value. A non-numeric entry used to
// produce `NaN`, which rendered as "N/P" in the PLD / Crown AUM cells and
// turned the schedule "Total AUM/Tonne" into "NaN".

const pasture = { id: 3535, pldPercent: 0.85 };
const livestockType = { id: 1, auFactor: 1 };
const dates = { dateIn: '2026-10-02', dateOut: '2026-10-31' };

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

describe('calcEntryAUMs numeric coercion (#1430)', () => {
  it('computes a numeric entry that is still being typed as 0, never NaN', () => {
    const result = calcEntryAUMs({ ...dates, livestockCount: '' }, pasture, livestockType);

    Object.values(result).forEach((value) => expect(isFiniteNumber(value)).toBe(true));
    expect(result.totalAUMs).toBe(0);
    expect(result.pldAUMs).toBe(0);
    expect(result.crownAUMs).toBe(0);
  });

  it('treats a non-numeric livestock count as 0 instead of NaN', () => {
    const result = calcEntryAUMs({ ...dates, livestockCount: 'abc' }, pasture, livestockType);

    expect(isFiniteNumber(result.totalAUMs)).toBe(true);
    expect(result.totalAUMs).toBe(0);
    expect(result.pldAUMs).toBe(0);
    expect(result.crownAUMs).toBe(0);
  });

  it('matches the numeric result for a count supplied as a numeric string', () => {
    const fromString = calcEntryAUMs({ ...dates, livestockCount: '20' }, pasture, livestockType);
    const fromNumber = calcEntryAUMs({ ...dates, livestockCount: 20 }, pasture, livestockType);

    expect(fromString).toEqual(fromNumber);
  });

  it('tolerates a pasture with no PLD percent', () => {
    const result = calcEntryAUMs({ ...dates, livestockCount: 20 }, { id: 3536, pldPercent: null }, livestockType);

    expect(isFiniteNumber(result.pldAUMs)).toBe(true);
    expect(result.pldAUMs).toBe(0);
  });
});

describe('calcCrownTotalAUMs (#1430)', () => {
  it('returns a finite total when one row has a non-numeric count', () => {
    const entries = [
      { pastureId: 3535, livestockTypeId: 1, ...dates, livestockCount: 20 },
      { pastureId: 3536, livestockTypeId: 1, ...dates, livestockCount: 'abc' },
    ];

    const total = calcCrownTotalAUMs(entries, [pasture, { id: 3536, pldPercent: null }], [livestockType]);

    expect(Number.isFinite(total)).toBe(true);
    expect(total).not.toBeNaN();
  });

  it('returns 0 for an empty schedule', () => {
    expect(calcCrownTotalAUMs([], [], [])).toBe(0);
  });
});
