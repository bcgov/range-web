import { normalize } from 'normalizr'
import planReducer from '../../reducers/planReducer'
import { storePlan } from '../../actions/storeActions'
import * as schema from '../../actionCreators/schema'

const initialState = {
  plans: {
    byId: {},
    allIds: []
  },
  pastures: {},
  plantCommunities: {},
  grazingSchedules: {},
  ministerIssues: {},
  confirmations: {},
  planStatusHistory: {},
  managementConsiderations: {},
  additionalRequirements: {}
}

const mockPlanData = {
  id: 'planId',
  rangeName: 'hello',
  pastures: [
    {
      id: 'pastureId',
      name: 'Pasture 1',
      notes: '',
      plantCommunities: [
        {
          id: 'plantCommunityId',
          approved: false
        }
      ]
    }
  ],
  grazingSchedules: [
    {
      id: 'grazingScheduleId',
      year: 2018,
      grazingScheduleEntries: [
        {
          id: 'grazingScheduleEntryId',
          narative: 'narative'
        }
      ]
    }
  ],
  ministerIssues: [
    {
      id: 'ministerIssueId',
      detail: 'detail'
    }
  ],
  confirmations: [
    {
      id: 'confirmationId',
      clientId: '00000000'
    }
  ],
  planStatusHistory: [
    {
      id: 'planStatusHistoryId',
      note: 'note'
    }
  ],
  managementConsiderations: [
    {
      id: 'managementConsiderationId',
      detail: 'detail'
    }
  ],
  additionalRequirements: [
    {
      id: 'additionalRequirementId',
      detail: 'detail'
    }
  ]
}

const mockState = {
  plans: {
    byId: {
      planId: {
        id: 'planId',
        rangeName: 'hello',
        pastures: ['pastureId'],
        grazingSchedules: ['grazingScheduleId'],
        ministerIssues: ['ministerIssueId'],
        confirmations: ['confirmationId'],
        planStatusHistory: ['planStatusHistoryId'],
        managementConsiderations: ['managementConsiderationId'],
        additionalRequirements: ['additionalRequirementId']
      }
    },
    allIds: ['planId']
  },
  pastures: {
    pastureId: {
      id: 'pastureId',
      name: 'Pasture 1',
      notes: '',
      plantCommunities: ['plantCommunityId']
    }
  },
  plantCommunities: {
    plantCommunityId: {
      id: 'plantCommunityId',
      approved: false
    }
  },
  grazingSchedules: {
    grazingScheduleId: {
      id: 'grazingScheduleId',
      year: 2018,
      grazingScheduleEntries: [
        {
          id: 'grazingScheduleEntryId',
          narative: 'narative'
        }
      ]
    }
  },
  ministerIssues: {
    ministerIssueId: {
      id: 'ministerIssueId',
      detail: 'detail'
    }
  },
  confirmations: {
    confirmationId: {
      id: 'confirmationId',
      clientId: '00000000'
    }
  },
  planStatusHistory: {
    planStatusHistoryId: {
      id: 'planStatusHistoryId',
      note: 'note'
    }
  },
  managementConsiderations: {
    managementConsiderationId: {
      id: 'managementConsiderationId',
      detail: 'detail'
    }
  },
  additionalRequirements: {
    additionalRequirementId: {
      id: 'additionalRequirementId',
      detail: 'detail'
    }
  }
}

describe('Plan reducer', () => {
  it('Initialized with the initial state', () => {
    expect(planReducer(undefined, {})).toEqual(initialState)
  })

  describe("Handles 'STORE_PLAN'", () => {
    it('Correctly stores the plans and related fields with initial state', () => {
      const normalized = normalize(mockPlanData, schema.plan)
      expect(planReducer(initialState, storePlan(normalized))).toEqual(
        mockState
      )
    })

    it('Correctly stores the plans and related fields with pre-existing state', () => {
      const normalized = normalize(mockPlanData, schema.plan)
      expect(planReducer(mockState, storePlan(normalized))).toEqual(mockState)
    })
  })
})
