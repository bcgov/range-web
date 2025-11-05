export * from './grazingSchedule';
export * from './hayCuttingSchedule';

export const round = (number, precision) => {
  const shift = (number, precision) => {
    const numArray = `${number}`.split('e');
    return +`${numArray[0]}e${numArray[1] ? +numArray[1] + precision : precision}`;
  };
  return shift(Math.round(shift(number, +precision)), -precision);
};
