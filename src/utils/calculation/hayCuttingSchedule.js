/**
 * Calculate the total tonnes for hay cutting schedule entries
 * @param {Array} entries the array of hay cutting schedule entries
 * @returns {float} the total tonnes
 */
export const calcTotalTonnes = (entries = []) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  if (entries.length === 0) {
    return 0;
  }

  return entries
    .map((entry) => {
      const { tonnes } = entry || {};
      return parseFloat(tonnes) || 0;
    })
    .reduce(reducer, 0)
    .toFixed(1);
};
