/* eslint-disable quotes, comma-dangle */
const mockPlanWithAgreement = {
  id: 1,
  rangeName: 'Crown',
  planStartDate: '2019-01-01T08:00:00.000Z',
  planEndDate: '2019-12-31T08:00:00.000Z',
  notes: null,
  altBusinessName: null,
  agreementId: 'RAN074308',
  statusId: 1,
  uploaded: true,
  amendmentTypeId: null,
  createdAt: '2018-11-22T00:39:55.309Z',
  updatedAt: '2018-11-22T00:39:56.120Z',
  effectiveAt: null,
  submittedAt: null,
  creatorId: 15,
  status: {
    id: 1,
    code: 'C',
    name: 'Created',
    active: true
  },
  extension: null,
  creator: {
    id: 15,
    username: 'idir\\maschuff',
    clientId: null,
    givenName: 'Marc',
    familyName: 'Schuffert',
    email: 'marc.schuffert@gov.bc.ca',
    phoneNumber: '250-847-6329',
    active: true,
    lastLoginAt: '2018-12-03T21:51:24.751Z'
  },
  pastures: [
    {
      id: 44,
      name: "Kyub's Pasture",
      allowableAum: 150,
      graceDays: 5,
      pldPercent: 0.6,
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      planId: 1,
      plantCommunities: []
    },
    {
      id: 1,
      name: 'Zobnik',
      allowableAum: 25,
      graceDays: 3,
      pldPercent: 0.65,
      notes: null,
      planId: 1,
      plantCommunities: [
        {
          id: 10,
          communityTypeId: 1,
          elevationId: null,
          pastureId: 1,
          purposeOfAction: 'none',
          name: null,
          aspect: null,
          url: null,
          notes: 'Ths is a note!',
          rangeReadinessDay: 1,
          rangeReadinessMonth: 6,
          rangeReadinessNote: null,
          approved: false,
          elevation: null,
          communityType: {
            id: 1,
            name: 'Alkali saltgrass',
            active: true
          },
          indicatorPlants: [],
          monitoringAreas: [],
          plantCommunityActions: []
        },
        {
          id: 14,
          communityTypeId: 3,
          elevationId: 1,
          pastureId: 1,
          purposeOfAction: 'maintain',
          name: null,
          aspect: 'Aspect',
          url: null,
          notes: 'Mid seral pinegrass',
          rangeReadinessDay: 4,
          rangeReadinessMonth: 1,
          rangeReadinessNote: 'This is a range readiness note',
          approved: true,
          elevation: {
            id: 1,
            name: '<500',
            active: true
          },
          communityType: {
            id: 3,
            name: 'Barclay willow',
            active: true
          },
          indicatorPlants: [
            {
              id: 30,
              plantSpeciesId: 1,
              plantCommunityId: 14,
              criteria: 'rangereadiness',
              value: 1,
              name: null,
              plantSpecies: {
                id: 1,
                name: 'Bentgrass',
                leafStage: null,
                stubbleHeight: null,
                annualGrowth: null,
                active: true,
                isShrubUse: false
              }
            },
            {
              id: 31,
              plantSpeciesId: 4,
              plantCommunityId: 14,
              criteria: 'rangereadiness',
              value: 10,
              name: null,
              plantSpecies: {
                id: 4,
                name: 'Bluegrass, Canada',
                leafStage: 2.5,
                stubbleHeight: 8,
                annualGrowth: null,
                active: true,
                isShrubUse: false
              }
            },
            {
              id: 36,
              plantSpeciesId: 4,
              plantCommunityId: 14,
              criteria: 'stubbleheight',
              value: 14,
              name: null,
              plantSpecies: {
                id: 4,
                name: 'Bluegrass, Canada',
                leafStage: 2.5,
                stubbleHeight: 8,
                annualGrowth: null,
                active: true,
                isShrubUse: false
              }
            },
            {
              id: 40,
              plantSpeciesId: 15,
              plantCommunityId: 14,
              criteria: 'shrubuse',
              value: 10,
              name: null,
              plantSpecies: {
                id: 15,
                name: 'Fescue, Altai',
                leafStage: 4.5,
                stubbleHeight: 17,
                annualGrowth: null,
                active: true,
                isShrubUse: false
              }
            },
            {
              id: 41,
              plantSpeciesId: 13,
              plantCommunityId: 14,
              criteria: 'shrubuse',
              value: 2,
              name: null,
              plantSpecies: {
                id: 13,
                name: 'Brome, Smooth',
                leafStage: 3,
                stubbleHeight: 10,
                annualGrowth: null,
                active: true,
                isShrubUse: false
              }
            }
          ],
          plantCommunityActions: [
            {
              id: 4,
              plantCommunityId: 14,
              actionTypeId: 1,
              name: null,
              details:
                'Ride at least once a week to check on location of livestock Ride at least once a week to check on location of livestock Ride at least once a week to check on location of livestock',
              noGrazeStartDay: null,
              noGrazeStartMonth: null,
              noGrazeEndDay: null,
              noGrazeEndMonth: null,
              actionType: {
                id: 1,
                name: 'Herding',
                active: true
              }
            },
            {
              id: 5,
              plantCommunityId: 14,
              actionTypeId: 2,
              name: null,
              details:
                'Ride at least once a week to check on location of livestock Ride at least once a week to check on location of livestock Ride at least once a week to check on location of livestock',
              noGrazeStartDay: null,
              noGrazeStartMonth: null,
              noGrazeEndDay: null,
              noGrazeEndMonth: null,
              actionType: {
                id: 2,
                name: 'Livestock Variables',
                active: true
              }
            },
            {
              id: 6,
              plantCommunityId: 14,
              actionTypeId: 3,
              name: null,
              details:
                'Ride at least once a week to check on location of livestock Ride at least once a week to check on location of livestock Ride at least once a week to check on location of livestock',
              noGrazeStartDay: null,
              noGrazeStartMonth: null,
              noGrazeEndDay: null,
              noGrazeEndMonth: null,
              actionType: {
                id: 3,
                name: 'Salting',
                active: true
              }
            }
          ],
          monitoringAreas: [
            {
              id: 9,
              rangelandHealthId: 1,
              plantCommunityId: 14,
              name: "Kyub's monitoring area",
              otherPurpose: 'This is the other purpose :)',
              location: null,
              transectAzimuth: null,
              latitude: null,
              longitude: null,
              rangelandHealth: {
                id: 1,
                name: 'Properly Functioning Condition',
                active: true
              },
              purposes: [
                {
                  id: 3,
                  purposeTypeId: 1,
                  monitoringAreaId: 9,
                  purposeType: {
                    id: 1,
                    name: 'Range Readiness',
                    active: true
                  }
                },
                {
                  id: 4,
                  purposeTypeId: 2,
                  monitoringAreaId: 9,
                  purposeType: {
                    id: 2,
                    name: 'Stubble Height',
                    active: true
                  }
                }
              ],
              purposeTypeIds: [1, 2]
            },
            {
              id: 16,
              rangelandHealthId: 3,
              plantCommunityId: 14,
              name: "Roop's monitoring area",
              otherPurpose: 'the other purpose',
              location: null,
              transectAzimuth: null,
              latitude: null,
              longitude: null,
              rangelandHealth: {
                id: 3,
                name: 'Moderately at Risk',
                active: true
              },
              purposes: [
                {
                  id: 8,
                  purposeTypeId: 1,
                  monitoringAreaId: 16,
                  purposeType: {
                    id: 1,
                    name: 'Range Readiness',
                    active: true
                  }
                }
              ],
              purposeTypeIds: [1]
            }
          ]
        }
      ]
    }
  ],
  grazingSchedules: [
    {
      id: 1,
      year: 2019,
      narative: null,
      planId: 1,
      grazingScheduleEntries: [
        {
          id: 1,
          graceDays: 3,
          livestockCount: 1,
          dateIn: '2019-06-01T07:00:00.000Z',
          dateOut: '2019-09-30T07:00:00.000Z',
          pastureId: 1,
          livestockTypeId: 2,
          grazingScheduleId: 1,
          livestockType: {
            id: 2,
            name: 'Bull',
            auFactor: 1.5,
            active: true
          }
        },
        {
          id: 2,
          graceDays: 3,
          livestockCount: 12,
          dateIn: '2019-06-01T07:00:00.000Z',
          dateOut: '2019-09-30T07:00:00.000Z',
          pastureId: 1,
          livestockTypeId: 1,
          grazingScheduleId: 1,
          livestockType: {
            id: 1,
            name: 'Cow with Calf',
            auFactor: 1,
            active: true
          }
        },
        {
          id: 3,
          graceDays: 3,
          livestockCount: 2,
          dateIn: '2019-06-01T07:00:00.000Z',
          dateOut: '2019-09-30T07:00:00.000Z',
          pastureId: 1,
          livestockTypeId: 3,
          grazingScheduleId: 1,
          livestockType: {
            id: 3,
            name: 'Yearling',
            auFactor: 0.7,
            active: true
          }
        }
      ]
    }
  ],
  ministerIssues: [
    {
      id: 8,
      detail: 'This is a pretty big issue',
      objective: 'Our objective is to address the issue....',
      identified: true,
      issueTypeId: 1,
      planId: 1,
      ministerIssueType: {
        id: 1,
        name: 'Community Watershed',
        active: true
      },
      pastures: [1],
      ministerIssueActions: []
    }
  ],
  planStatusHistory: [],
  confirmations: [],
  invasivePlantChecklist: {
    id: 1,
    planId: 1,
    equipmentAndVehiclesParking: true,
    beginInUninfestedArea: true,
    undercarrigesInspected: true,
    revegetate: false,
    other: 'Control Canada Thistle by mowing'
  },
  additionalRequirements: [
    {
      id: 15,
      detail: 'This is the detail',
      url: 'www.google.com',
      categoryId: 1,
      planId: 1,
      category: {
        id: 1,
        name: 'Notice or Order',
        active: true
      }
    },
    {
      id: 16,
      detail:
        'This is the detail very very long. This is the detail very very long. This is the detail very very long. This is the detail very very long.',
      url: 'www.google.com',
      categoryId: 3,
      planId: 1,
      category: {
        id: 3,
        name: 'Memorandum of Understanding',
        active: true
      }
    }
  ],
  managementConsiderations: [
    {
      id: 17,
      detail:
        'This is the detail for a consideration. This is the detail for a consideration. This is the detail for a consideration. This is the detail for a consideration.',
      url: 'www.google.com',
      considerationTypeId: 1,
      planId: 1,
      considerationType: {
        id: 1,
        name: 'Concern',
        active: true
      }
    }
  ],
  agreement: {
    forestFileId: 'RAN074308',
    agreementStartDate: '2000-01-01T08:00:00.000Z',
    agreementEndDate: '2019-12-31T08:00:00.000Z',
    zoneId: 13,
    agreementExemptionStatusId: 1,
    agreementTypeId: 1,
    zone: {
      id: 13,
      code: 'BULK',
      description: 'Bulkley',
      districtId: 2,
      userId: 15,
      district: {
        id: 2,
        code: 'DSS',
        description: ''
      },
      user: {
        id: 15,
        username: 'idir\\maschuff',
        clientId: null,
        givenName: 'Marc',
        familyName: 'Schuffert',
        email: 'marc.schuffert@gov.bc.ca',
        phoneNumber: '250-847-6329',
        active: true,
        lastLoginAt: '2018-12-03T21:51:24.751Z'
      }
    },
    agreementType: {
      id: 1,
      code: 'E01',
      description: 'Grazing Licence',
      active: true
    },
    agreementExemptionStatus: {
      id: 1,
      code: 'N',
      description: 'Not Exempt',
      active: true
    },
    clients: [
      {
        id: '00074435',
        locationCode: '01',
        name: 'TRIGIANI, MICHAEL DAVID',
        clientTypeCode: 'A',
        startDate: null,
        endDate: null
      },
      {
        id: '00180909',
        locationCode: '00',
        name: 'TRIGIANI, HEATHER DIANE',
        clientTypeCode: 'B',
        startDate: null,
        endDate: null
      }
    ],
    usage: [
      {
        id: 1021,
        year: 2000,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 1022,
        year: 2001,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 1023,
        year: 2002,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 1024,
        year: 2003,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 1025,
        year: 2004,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 22472,
        year: 2005,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 1026,
        year: 2006,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 1027,
        year: 2007,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 6009,
        year: 2008,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 6010,
        year: 2009,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 8220,
        year: 2010,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 8221,
        year: 2011,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 8222,
        year: 2012,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 8223,
        year: 2013,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 8224,
        year: 2014,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 17515,
        year: 2015,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 17516,
        year: 2016,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 17517,
        year: 2017,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 17518,
        year: 2018,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      },
      {
        id: 17519,
        year: 2019,
        authorizedAum: 25,
        temporaryIncrease: 0,
        totalNonUse: 0,
        totalAnnualUse: 25,
        agreementId: 'RAN074308'
      }
    ],
    livestockIdentifiers: [],
    id: 'RAN074308'
  }
}
export default mockPlanWithAgreement
