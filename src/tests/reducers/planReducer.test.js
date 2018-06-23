import { normalize } from 'normalizr';
import planReducer from '../../reducers/planReducer';
import { storePlan } from '../../actions/storeActions';
import * as schema from '../../actionCreators/schema';

const initialState = {
  plans: {},
  planIds: [],
  pastures: {},
  grazingSchedules: {},
  ministerIssues: {},
};

const mockPlanData = {
  id: 'plan_id',
  rangeName: 'hello',
  pastures: [
    {
      id: 'pasture_id',
      name: 'Pasture 1',
    },
  ],
  grazingSchedules: [
    {
      id: 'grazing_schedule_id',
      year: 2018,
    },
  ],
  ministerIssues: [
    {
      id: 'minister_issue_id',
      detail: 'detail',
    },
  ],
};

const mockState = {
  plans: {
    plan_id: {
      id: 'plan_id',
      rangeName: 'hello',
      pastures: ['pasture_id'],
      grazingSchedules: ['grazing_schedule_id'],
      ministerIssues: ['minister_issue_id'],
    },
  },
  planIds: ['plan_id'],
  pastures: {
    pasture_id: {
      id: 'pasture_id',
      name: 'Pasture 1',
    },
  },
  grazingSchedules: {
    grazing_schedule_id: {
      id: 'grazing_schedule_id',
      year: 2018,
    },
  },
  ministerIssues: {
    minister_issue_id: {
      id: 'minister_issue_id',
      detail: 'detail',
    },
  },
};

describe('Plan reducer', () => {
  it('Initialized with the initial state', () => {
    expect(planReducer(undefined, {})).toEqual(initialState);
  });

  describe('Handles \'STORE_PLAN\'', () => {
    it('Correctly stores the plans and related fields with initial state', () => {
      const normalized = normalize(mockPlanData, schema.plan);
      expect(planReducer(initialState, storePlan(normalized))).toEqual(mockState);
    });

    it('Correctly stores the plans and related fields with pre-existing state', () => {
      const normalized = normalize(mockPlanData, schema.plan);
      expect(planReducer(mockState, storePlan(normalized))).toEqual(mockState);
    });
  });
});
