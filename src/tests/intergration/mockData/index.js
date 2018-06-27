export { default as mockAgreements } from './mockAgreements';
export { default as mockPlan } from './mockPlan';

export const mockAgreement = {
  perPage: 10,
  currentPage: 1,
  totalItems: 1513,
  totalPages: 152,
  agreements: [
    {
      id: 'RAN075974',
      plans: [],
    },
  ],
};

export const mockRequestHeader = token => ({
  headers: {
    'Authorization': `Bearer ${token}`,
    'content-type': 'application/json',
  },
});
