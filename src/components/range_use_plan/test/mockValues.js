export const rangeUsePlan = (number) => (
  {
    number,
    tenureHolder: {
      name: `tenure holder #${number}`
    }
  }
)

export const rangeUsePlans = [1, 2].map(number => {
  return rangeUsePlan(number);
});

