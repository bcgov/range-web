export const getMockTenureAgreement = (number) => (
  {
    number,
    tenureHolder: {
      name: `tenure holder #${number}`
    }
  }
)

export const getMockTenureAgreements = (length) => {
  const array = Array.from(new Array(length), (x,i) => i);
  return array.map(number => getMockTenureAgreement(number + 1));
}
