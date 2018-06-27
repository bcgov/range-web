export { default as mockAgreements } from './mockAgreements';
export { default as mockPlan } from './mockPlan';
export { default as mockAgreement } from './mockAgreement';
export const mockRequestHeader = token => ({
  headers: {
    'Authorization': `Bearer ${token}`,
    'content-type': 'application/json',
  },
});
