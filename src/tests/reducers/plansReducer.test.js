import { normalize } from 'normalizr';
import plansReducer from '../../reducers/planReducer/plansReducer';
import { storePlan, planUpdated, addGrazingSchedule } from '../../actions';
import * as schema from '../../actionCreators/schema';

const initialState = {
  byId: {},
  allIds: [],
};

const mockPlanData = {
  id: 'plan_id',
  rangeName: 'hello',
  obj: {
    prop: 'value',
  },
};

const mockState = {
  byId: {
    'plan_id': {
      id: 'plan_id',
      rangeName: 'hello',
      obj: {
        prop: 'value',
      },
    },
  },
  allIds: ['plan_id'],
};

describe('Plan reducer', () => {
  it('Initialized with the initial state', () => {
    expect(plansReducer(undefined, {})).toEqual(initialState);
  });

  describe('Handles `STORE_PLAN`', () => {
    it('Correctly stores a plan with initial state', () => {
      const normalized = normalize(mockPlanData, schema.plan);
      expect(plansReducer(initialState, storePlan(normalized))).toEqual(mockState);
    });

    it('Correctly stores a plan with pre-existing state', () => {
      const normalized = normalize(mockPlanData, schema.plan);
      expect(plansReducer(mockState, storePlan(normalized))).toEqual(mockState);
    });
  });

  describe('Handles `PLAN_UPDATED`', () => {
    it('Correctly store a plan with initial state and update the plan', () => {
      const mockUpdatedPlanData = {
        id: 'plan_id',
        rangeName: 'changed',
        obj: {
          prop: 'changed',
        },
      };
      const mockStateForUpdatedPlanData = {
        byId: {
          'plan_id': {
            id: 'plan_id',
            rangeName: 'changed',
            obj: {
              prop: 'changed',
            },
          },
        },
        allIds: ['plan_id'],
      };
      expect(plansReducer(mockState, planUpdated({ plan: mockUpdatedPlanData }))).toEqual(mockStateForUpdatedPlanData);
    });
  });

  describe('Handles `ADD_GRAZING_SCHEDULE`', () => {
    it('Correctly add a grazing schedule when the field doesn\'t exist and does exist', () => {
      const state = {
        byId: {
          'plan_id': {
            id: 'plan_id',
          },
        },
        allIds: ['plan_id'],
      };
      const payload = {
        planId: 'plan_id',
        grazingSchedules: [
          'grazing_schedule_id',
        ],
      };
      const result = {
        byId: {
          'plan_id': {
            id: 'plan_id',
            grazingSchedules: ['grazing_schedule_id'],
          },
        },
        allIds: ['plan_id'],
      };
      expect(plansReducer(state, addGrazingSchedule(payload))).toEqual(result);
    });
  });
});
