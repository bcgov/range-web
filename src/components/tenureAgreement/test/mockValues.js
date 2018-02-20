export const getTenureAgreement = (number) => (
  {
    number,
    tenureHolder: {
      name: `tenure holder #${number}`
    }
  }
)

export const getTenureAgreements = (length) => {
  const array = Array.from(new Array(length), (x,i) => i);
  return array.map(number => getTenureAgreement(number));
}
