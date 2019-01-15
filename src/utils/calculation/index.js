export * from './grazingSchedule';

const round = (number, precision) => {
  const shift = (number, precision) => {
    const numArray = (`${number}`).split('e');
    return +(`${numArray[0]}e${(numArray[1] ? (+numArray[1] + precision) : precision)}`);
  };
  return shift(Math.round(shift(number, +precision)), -precision);
};

/**
 * Round the float to 1 decimal
 *
 * @param {float} number
 * @returns the rounded float number
 */
export const roundTo1Decimal = (number = 0) => (
  round(number, 1)
);
