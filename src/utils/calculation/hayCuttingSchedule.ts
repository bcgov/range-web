interface HayCuttingEntry {
  tonnes?: number | string | null;
}

/**
 * Calculate the total tonnes for hay cutting schedule entries
 * @param entries the array of hay cutting schedule entries
 * @returns the total tonnes as a string with 1 decimal place
 */
export const calcTotalTonnes = (entries: HayCuttingEntry[] = []): string => {
  const reducer = (accumulator: number, currentValue: number): number => accumulator + currentValue;
  if (entries.length === 0) {
    return '0.0';
  }

  return entries
    .map((entry) => {
      const { tonnes } = entry || {};
      return parseFloat(String(tonnes)) || 0;
    })
    .reduce(reducer, 0)
    .toFixed(1);
};
