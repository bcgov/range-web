export * from './grazingSchedule';
export * from './hayCuttingSchedule';

export const round = (number, precision) => {
  const shift = (number, precision) => {
    const numArray = `${number}`.split('e');
    return +`${numArray[0]}e${numArray[1] ? +numArray[1] + precision : precision}`;
  };
  return shift(Math.round(shift(number, +precision)), -precision);
};

// Format percent use - round up with no decimal places
// If value is between 0 and 1 (exclusive), set to 1
// Otherwise, round up to nearest integer
export const roundUpPercentUse = (percentUse) => {
  if (percentUse === undefined || percentUse === null || isNaN(percentUse)) {
    return 0;
  }
  const value = parseFloat(percentUse);
  if (value > 0 && value < 1) {
    return 1;
  }
  return Math.ceil(value);
};
