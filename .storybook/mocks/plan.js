export default {
  id: 45,
  rangeName: 'banana range 2',
  planStartDate: '2018-01-15T08:00:00.000Z',
  planEndDate: '2022-08-31T07:00:00.000Z',
  notes: null,
  altBusinessName: 'BR2',
  agreementId: 'RAN099926',
  statusId: 4,
  uploaded: true,
  amendmentTypeId: null,
  createdAt: '2019-05-07T00:10:26.688Z',
  updatedAt: '2019-08-21T14:19:33.380Z',
  effectiveAt: null,
  submittedAt: null,
  creatorId: 64,
  status: { id: 4, code: 'D', name: 'Draft', active: true },
  extension: null,
  creator: {
    id: 64,
    username: 'idir\\mwwells',
    clientId: null,
    givenName: 'Mike',
    familyName: 'Wells',
    email: 'micheal.w.wells@gov.bc.ca',
    phoneNumber: null,
    active: true,
    piaSeen: true,
    lastLoginAt: '2019-08-21T04:01:52.574Z',
  },
  pastures: [
    {
      id: 112,
      name: 'pasture 1',
      allowableAum: null,
      graceDays: null,
      pldPercent: null,
      notes: null,
      planId: 45,
      plantCommunities: [
        {
          id: 41,
          communityTypeId: 5,
          elevationId: null,
          pastureId: 112,
          purposeOfAction: 'none',
          name: 'Cattail',
          aspect: null,
          url: null,
          notes: null,
          rangeReadinessDay: null,
          rangeReadinessMonth: null,
          rangeReadinessNote: null,
          approved: false,
          shrubUse: null,
          elevation: null,
          communityType: { id: 5, name: 'Cattail', active: true },
          indicatorPlants: [],
          monitoringAreas: [],
          plantCommunityActions: [],
        },
        {
          id: 42,
          communityTypeId: 5,
          elevationId: null,
          pastureId: 112,
          purposeOfAction: 'none',
          name: 'Cattail',
          aspect: 'aspect2',
          url: null,
          notes: 'notes',
          rangeReadinessDay: null,
          rangeReadinessMonth: null,
          rangeReadinessNote: null,
          approved: false,
          shrubUse: null,
          elevation: null,
          communityType: { id: 5, name: 'Cattail', active: true },
          indicatorPlants: [],
          plantCommunityActions: [],
          monitoringAreas: [],
        },
      ],
    },
    {
      id: 113,
      name: 'A different pasture',
      allowableAum: null,
      graceDays: null,
      pldPercent: null,
      notes: null,
      planId: 45,
    },
    {
      id: 114,
      name: 'My second pasture',
      allowableAum: null,
      graceDays: null,
      pldPercent: null,
      notes: null,
      planId: 45,
    },
  ],
  grazingSchedules: [
    {
      id: 101,
      year: 2018,
      narative: null,
      planId: 45,
      grazingScheduleEntries: [
        {
          id: 110,
          graceDays: 3,
          livestockCount: 1,
          dateIn: '2018-01-16T08:00:00.000Z',
          dateOut: '2018-01-19T08:00:00.000Z',
          pastureId: 1120,
          livestockTypeId: 5,
          grazingScheduleId: 101,
        },
        {
          id: 111,
          graceDays: 2,
          livestockCount: 5,
          dateIn: '2018-01-11T08:00:00.000Z',
          dateOut: '2018-03-20T08:00:00.000Z',
          pastureId: 112,
          livestockTypeId: 2,
          grazingScheduleId: 101,
        },
        {
          id: 112,
          graceDays: 5,
          livestockCount: 2,
          dateIn: '2018-05-04T08:00:00.000Z',
          dateOut: '2018-08-04T08:00:00.000Z',
          pastureId: 114,
          livestockTypeId: 2,
          grazingScheduleId: 101,
        },
      ],
    },
    {
      id: 113,
      year: 2019,
      narative: null,
      planId: 45,
      grazingScheduleEntries: [
        {
          id: 122,
          graceDays: 6,
          livestockCount: 24,
          dateIn: '2019-04-16T07:00:00.000Z',
          dateOut: '2019-06-21T07:00:00.000Z',
          pastureId: 41,
          livestockTypeId: 3,
          grazingScheduleId: 113,
          livestockType: {
            id: 3,
            name: 'Yearling',
            auFactor: 0.7,
            active: true,
          },
        },
      ],
    },
  ],
  ministerIssues: [],
  planStatusHistory: [
    {
      id: 48,
      planId: 45,
      fromPlanStatusId: 4,
      toPlanStatusId: 4,
      userId: 68,
      note: ' ',
      createdAt: '2019-08-15T18:25:55.352Z',
      updatedAt: '2019-08-15T18:25:55.352Z',
      user: {
        id: 68,
        username: 'dev_client',
        clientId: '09999906',
        givenName: 'Ranger',
        familyName: 'Smith',
        email: 'range+client@twostoryrobot.com',
        phoneNumber: null,
        active: true,
        piaSeen: true,
        lastLoginAt: '2019-08-21T17:33:03.573Z',
      },
    },
    {
      id: 47,
      planId: 45,
      fromPlanStatusId: 1,
      toPlanStatusId: 4,
      userId: 68,
      note: ' ',
      createdAt: '2019-06-25T21:31:57.172Z',
      updatedAt: '2019-06-25T21:31:57.172Z',
      user: {
        id: 68,
        username: 'dev_client',
        clientId: '09999906',
        givenName: 'Ranger',
        familyName: 'Smith',
        email: 'range+client@twostoryrobot.com',
        phoneNumber: null,
        active: true,
        piaSeen: true,
        lastLoginAt: '2019-08-21T17:33:03.573Z',
      },
    },
    {
      id: 42,
      planId: 45,
      fromPlanStatusId: 6,
      toPlanStatusId: 1,
      userId: 67,
      note: ' ',
      createdAt: '2019-06-05T15:04:58.054Z',
      updatedAt: '2019-06-05T15:04:58.054Z',
      user: {
        id: 67,
        username: 'dev_admin',
        clientId: null,
        givenName: 'Ranger',
        familyName: 'Smith',
        email: 'range+admin@twostoryrobot.com',
        phoneNumber: null,
        active: true,
        piaSeen: true,
        lastLoginAt: '2019-08-21T14:14:07.164Z',
      },
    },
  ],
  confirmations: [
    {
      id: 79,
      planId: 45,
      clientId: '09999902',
      confirmed: false,
      createdAt: '2019-05-07T00:10:26.755Z',
      updatedAt: '2019-05-07T00:10:26.755Z',
    },
    {
      id: 80,
      planId: 45,
      clientId: '09999906',
      confirmed: false,
      createdAt: '2019-05-07T00:10:26.761Z',
      updatedAt: '2019-05-07T00:10:26.761Z',
    },
  ],
  invasivePlantChecklist: {
    id: 26,
    planId: 45,
    equipmentAndVehiclesParking: true,
    beginInUninfestedArea: false,
    undercarrigesInspected: false,
    revegetate: false,
    other: null,
  },
  additionalRequirements: [
    {
      id: 2,
      detail: 'Asdfasdfasdf',
      url: null,
      categoryId: 3,
      planId: 45,
      category: { id: 3, name: 'Memorandum of Understanding', active: true },
    },
  ],
  managementConsiderations: [],
  agreement: {
    forestFileId: 'RAN099926',
    agreementStartDate: '2018-01-01T08:00:00.000Z',
    agreementEndDate: '2023-12-31T08:00:00.000Z',
    zoneId: 56,
    agreementExemptionStatusId: 1,
    agreementTypeId: 1,
    zone: {
      id: 56,
      code: 'TEST2',
      description: 'Second Test Zone',
      districtId: 23,
      userId: 66,
      district: {
        id: 23,
        code: 'TST',
        description: 'Dummy district for testing',
      },
      user: {
        id: 66,
        username: 'range@twostoryrobot.com',
        clientId: null,
        givenName: 'Ranger',
        familyName: 'Smith',
        email: 'range@twostoryrobot.com',
        phoneNumber: null,
        active: true,
        piaSeen: true,
        lastLoginAt: '2019-08-21T15:48:54.581Z',
      },
    },
    agreementType: {
      id: 1,
      code: 'E01',
      description: 'Grazing Licence',
      active: true,
    },
    agreementExemptionStatus: {
      id: 1,
      code: 'N',
      description: 'Not Exempt',
      active: true,
    },
    clients: [
      {
        id: '09999906',
        locationCode: '01',
        name: 'Ann Perkins',
        clientTypeCode: 'A',
        startDate: null,
        endDate: null,
      },
      {
        id: '09999902',
        locationCode: '01',
        name: 'Ron Swanson',
        clientTypeCode: 'B',
        startDate: null,
        endDate: null,
      },
    ],
    usage: [
      {
        id: 28546,
        year: 2018,
        authorizedAum: 100,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 100,
        agreementId: 'RAN099926',
      },
      {
        id: 28582,
        year: 2019,
        authorizedAum: 200,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 200,
        agreementId: 'RAN099926',
      },
      {
        id: 28618,
        year: 2020,
        authorizedAum: 300,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 300,
        agreementId: 'RAN099926',
      },
      {
        id: 28654,
        year: 2021,
        authorizedAum: 400,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 400,
        agreementId: 'RAN099926',
      },
      {
        id: 28690,
        year: 2022,
        authorizedAum: 500,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 500,
        agreementId: 'RAN099926',
      },
      {
        id: 28726,
        year: 2023,
        authorizedAum: 600,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 600,
        agreementId: 'RAN099926',
      },
    ],
    livestockIdentifiers: [],
    id: 'RAN099926',
  },
};
