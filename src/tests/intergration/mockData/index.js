import { getToken } from '../../../reducers/rootReducer';

export { default as mockAgreements } from './mockAgreements';
export { default as mockPlan } from './mockPlan';
export { default as mockReference } from './mockReference';
export { default as mockUsers } from './mockUsers';
export { default as mockZones } from './mockZones';

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

export const mockRequestHeader = (getState) => {
  const token = getToken(getState());

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  };
};
