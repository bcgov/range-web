export const getMockTenureAgreement = (number) => (
  {
    id: number,
    number,
    status: 'pending',
    region: `Victoria Ranch ${number}`,
    tenureHolder: {
      name: `tenure holder ${number}`
    }
  }
)

export const getMockTenureAgreements = (length) => {
  const array = Array.from(new Array(length), (x,i) => i);
  return array.map(number => getMockTenureAgreement(number + 1));
}
