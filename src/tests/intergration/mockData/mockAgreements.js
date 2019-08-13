/* eslint-disable quotes, comma-dangle */
const paginatedMockAgreements = {
  perPage: 10,
  currentPage: 1,
  totalItems: 1513,
  totalPages: 152,
  agreements: [
    {
      forestFileId: 'RAN075974',
      agreementStartDate: '2014-01-01T08:00:00.000Z',
      agreementEndDate: '2023-12-31T08:00:00.000Z',
      zoneId: 34,
      agreementExemptionStatusId: 1,
      agreementTypeId: 1,
      zone: {
        id: 34,
        code: 'SPC',
        description: 'South Peace',
        districtId: 9,
        userId: 18,
        district: {
          id: 9,
          code: 'DCP',
          description: ''
        },
        user: {
          id: 18,
          username: 'marcamer',
          clientId: null,
          givenName: 'Marika',
          familyName: 'Cameron',
          email: 'marika.cameron@gov.bc.ca',
          phoneNumber: null,
          active: false,
          lastLoginAt: null,
          roles: []
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
          id: '00065458',
          locationCode: '01',
          name: 'MULVAHILL, LANCE ',
          clientTypeCode: 'A',
          startDate: null
        },
        {
          id: '00065457',
          locationCode: '00',
          name: 'MULVAHILL, MICHAEL JOHN',
          clientTypeCode: 'B',
          startDate: null
        }
      ],
      usage: [
        {
          id: 23101,
          year: 2023,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 85,
          agreementId: 'RAN075974'
        },
        {
          id: 15003,
          year: 2022,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 85,
          agreementId: 'RAN075974'
        },
        {
          id: 15002,
          year: 2021,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 85,
          agreementId: 'RAN075974'
        },
        {
          id: 15001,
          year: 2020,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 85,
          agreementId: 'RAN075974'
        },
        {
          id: 15000,
          year: 2019,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 8,
          totalAnnualUse: 77,
          agreementId: 'RAN075974'
        },
        {
          id: 14999,
          year: 2018,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 21,
          totalAnnualUse: 64,
          agreementId: 'RAN075974'
        },
        {
          id: 14998,
          year: 2017,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 42,
          totalAnnualUse: 43,
          agreementId: 'RAN075974'
        },
        {
          id: 14997,
          year: 2016,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 85,
          totalAnnualUse: 0,
          agreementId: 'RAN075974'
        },
        {
          id: 14996,
          year: 2015,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 85,
          totalAnnualUse: 0,
          agreementId: 'RAN075974'
        },
        {
          id: 14995,
          year: 2014,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 3,
          totalAnnualUse: 82,
          agreementId: 'RAN075974'
        },
        {
          id: 9428,
          year: 2013,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 3,
          totalAnnualUse: 82,
          agreementId: 'RAN075974'
        },
        {
          id: 9427,
          year: 2012,
          authorizedAum: 85,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 85,
          agreementId: 'RAN075974'
        },
        {
          id: 9425,
          year: 2011,
          authorizedAum: 606,
          temporaryIncrease: 0,
          totalNonUse: 525,
          totalAnnualUse: 81,
          agreementId: 'RAN075974'
        },
        {
          id: 3900,
          year: 2010,
          authorizedAum: 606,
          temporaryIncrease: 0,
          totalNonUse: 525,
          totalAnnualUse: 81,
          agreementId: 'RAN075974'
        },
        {
          id: 3899,
          year: 2009,
          authorizedAum: 606,
          temporaryIncrease: 0,
          totalNonUse: 331,
          totalAnnualUse: 275,
          agreementId: 'RAN075974'
        },
        {
          id: 3898,
          year: 2008,
          authorizedAum: 606,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 606,
          agreementId: 'RAN075974'
        },
        {
          id: 3897,
          year: 2007,
          authorizedAum: 285,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 285,
          agreementId: 'RAN075974'
        },
        {
          id: 3896,
          year: 2006,
          authorizedAum: 606,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 606,
          agreementId: 'RAN075974'
        },
        {
          id: 3895,
          year: 2005,
          authorizedAum: 495,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 495,
          agreementId: 'RAN075974'
        },
        {
          id: 3325,
          year: 2004,
          authorizedAum: 495,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 495,
          agreementId: 'RAN075974'
        }
      ],
      plans: [],
      livestockIdentifiers: [],
      id: 'RAN075974'
    },
    {
      forestFileId: 'RAN076108',
      agreementStartDate: '2014-01-01T08:00:00.000Z',
      agreementEndDate: '2023-12-31T08:00:00.000Z',
      zoneId: 1,
      agreementExemptionStatusId: 1,
      agreementTypeId: 1,
      zone: {
        id: 1,
        code: 'CHIM',
        description: 'Chimney Creek Livestock Assoc',
        districtId: 1,
        userId: 30,
        district: {
          id: 1,
          code: 'DCC',
          description: ''
        },
        user: {
          id: 30,
          username: 'carmes',
          clientId: null,
          givenName: 'Chris',
          familyName: 'Armes',
          email: 'chris.armes@gov.bc.ca',
          phoneNumber: null,
          active: false,
          lastLoginAt: null,
          roles: []
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
          id: '00066835',
          locationCode: '00',
          name: 'WATT, CYNTHIA ANN',
          clientTypeCode: 'A',
          startDate: null
        }
      ],
      usage: [
        {
          id: 24518,
          year: 2023,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 7,
          totalAnnualUse: 0,
          agreementId: 'RAN076108'
        },
        {
          id: 16435,
          year: 2022,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 7,
          totalAnnualUse: 0,
          agreementId: 'RAN076108'
        },
        {
          id: 16434,
          year: 2021,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 7,
          totalAnnualUse: 0,
          agreementId: 'RAN076108'
        },
        {
          id: 16433,
          year: 2020,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 7,
          totalAnnualUse: 0,
          agreementId: 'RAN076108'
        },
        {
          id: 16432,
          year: 2019,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 7,
          totalAnnualUse: 0,
          agreementId: 'RAN076108'
        },
        {
          id: 16431,
          year: 2018,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 7,
          totalAnnualUse: 0,
          agreementId: 'RAN076108'
        },
        {
          id: 16430,
          year: 2017,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 7,
          totalAnnualUse: 0,
          agreementId: 'RAN076108'
        },
        {
          id: 16429,
          year: 2016,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 25209,
          year: 2015,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 25210,
          year: 2014,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 2910,
          year: 2013,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 2909,
          year: 2012,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 2914,
          year: 2011,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 2908,
          year: 2010,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 2913,
          year: 2009,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 2907,
          year: 2008,
          authorizedAum: 33,
          temporaryIncrease: 0,
          totalNonUse: 33,
          totalAnnualUse: 0,
          agreementId: 'RAN076108'
        },
        {
          id: 2912,
          year: 2007,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 2906,
          year: 2006,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 2911,
          year: 2005,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        },
        {
          id: 2905,
          year: 2004,
          authorizedAum: 7,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 7,
          agreementId: 'RAN076108'
        }
      ],
      plans: [],
      livestockIdentifiers: [],
      id: 'RAN076108'
    },
    {
      forestFileId: 'RAN076567',
      agreementStartDate: '2018-01-01T08:00:00.000Z',
      agreementEndDate: '2042-12-31T08:00:00.000Z',
      zoneId: 47,
      agreementExemptionStatusId: 1,
      agreementTypeId: 1,
      zone: {
        id: 47,
        code: 'EFA',
        description: 'East Fraser',
        districtId: 13,
        userId: 20,
        district: {
          id: 13,
          code: 'DQU',
          description: ''
        },
        user: {
          id: 20,
          username: 'tsinger',
          clientId: null,
          givenName: 'Tim',
          familyName: 'Singer',
          email: 'tim.singer@gov.bc.ca',
          phoneNumber: null,
          active: false,
          lastLoginAt: null,
          roles: []
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
          id: '00166681',
          locationCode: '01',
          name: 'THIESSEN, IVAN DEAN',
          clientTypeCode: 'A',
          startDate: null
        },
        {
          id: '00166680',
          locationCode: '00',
          name: 'THIESSEN, BONITA ROSE',
          clientTypeCode: 'B',
          startDate: null
        }
      ],
      usage: [
        {
          id: 23568,
          year: 2042,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23567,
          year: 2041,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23566,
          year: 2040,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23565,
          year: 2039,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23564,
          year: 2038,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23563,
          year: 2037,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23562,
          year: 2036,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23561,
          year: 2035,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23560,
          year: 2034,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23559,
          year: 2033,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23558,
          year: 2032,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23557,
          year: 2031,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23556,
          year: 2030,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23555,
          year: 2029,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23554,
          year: 2028,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23553,
          year: 2027,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23552,
          year: 2026,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23551,
          year: 2025,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23550,
          year: 2024,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23549,
          year: 2023,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23548,
          year: 2022,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23547,
          year: 2021,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23546,
          year: 2020,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23545,
          year: 2019,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 23544,
          year: 2018,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 17664,
          year: 2017,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 2,
          totalAnnualUse: 436,
          agreementId: 'RAN076567'
        },
        {
          id: 21252,
          year: 2016,
          authorizedAum: 436,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 436,
          agreementId: 'RAN076567'
        },
        {
          id: 6896,
          year: 2015,
          authorizedAum: 842,
          temporaryIncrease: 0,
          totalNonUse: 404,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 6895,
          year: 2014,
          authorizedAum: 816,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 816,
          agreementId: 'RAN076567'
        },
        {
          id: 6894,
          year: 2013,
          authorizedAum: 651,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 651,
          agreementId: 'RAN076567'
        },
        {
          id: 6893,
          year: 2012,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 6892,
          year: 2011,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 6891,
          year: 2010,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 6890,
          year: 2009,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        },
        {
          id: 21251,
          year: 2008,
          authorizedAum: 438,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 438,
          agreementId: 'RAN076567'
        }
      ],
      plans: [],
      livestockIdentifiers: [],
      id: 'RAN076567'
    },
    {
      forestFileId: 'RAN077020',
      agreementStartDate: '2017-01-01T08:00:00.000Z',
      agreementEndDate: '2041-12-31T08:00:00.000Z',
      zoneId: 57,
      agreementExemptionStatusId: 1,
      agreementTypeId: 1,
      zone: {
        id: 57,
        code: 'DOS3',
        description: 'Please update contact and description',
        districtId: 15,
        userId: 34,
        district: {
          id: 15,
          code: 'DOS',
          description: ''
        },
        user: {
          id: 34,
          username: 'rdinwood',
          clientId: null,
          givenName: 'Rob',
          familyName: 'Dinwoodie',
          email: 'rob.dinwoodie@gov.bc.ca',
          phoneNumber: null,
          active: false,
          lastLoginAt: null,
          roles: []
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
          id: '00175717',
          locationCode: '00',
          name: 'THOMSON, COLIN GIFFORD MAGNUS',
          clientTypeCode: 'A',
          startDate: null
        }
      ],
      usage: [
        {
          id: 25417,
          year: 2041,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25416,
          year: 2040,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25415,
          year: 2039,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25414,
          year: 2038,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25413,
          year: 2037,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25412,
          year: 2036,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25411,
          year: 2035,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25410,
          year: 2034,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25409,
          year: 2033,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25408,
          year: 2032,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25407,
          year: 2031,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25406,
          year: 2030,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25405,
          year: 2029,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25404,
          year: 2028,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25403,
          year: 2027,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25402,
          year: 2026,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25401,
          year: 2025,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25400,
          year: 2024,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25399,
          year: 2023,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25398,
          year: 2022,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25397,
          year: 2021,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25396,
          year: 2020,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25395,
          year: 2019,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 25394,
          year: 2018,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 23187,
          year: 2017,
          authorizedAum: 238,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 238,
          agreementId: 'RAN077020'
        },
        {
          id: 20498,
          year: 2016,
          authorizedAum: 1432,
          temporaryIncrease: 0,
          totalNonUse: 1182,
          totalAnnualUse: 250,
          agreementId: 'RAN077020'
        },
        {
          id: 22835,
          year: 2015,
          authorizedAum: 1432,
          temporaryIncrease: 0,
          totalNonUse: 1182,
          totalAnnualUse: 250,
          agreementId: 'RAN077020'
        },
        {
          id: 9084,
          year: 2014,
          authorizedAum: 1182,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1182,
          agreementId: 'RAN077020'
        },
        {
          id: 9083,
          year: 2013,
          authorizedAum: 1182,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1182,
          agreementId: 'RAN077020'
        },
        {
          id: 9082,
          year: 2012,
          authorizedAum: 1182,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1182,
          agreementId: 'RAN077020'
        },
        {
          id: 9081,
          year: 2011,
          authorizedAum: 1182,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1182,
          agreementId: 'RAN077020'
        },
        {
          id: 9080,
          year: 2010,
          authorizedAum: 1182,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1182,
          agreementId: 'RAN077020'
        },
        {
          id: 7659,
          year: 2009,
          authorizedAum: 1182,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1182,
          agreementId: 'RAN077020'
        },
        {
          id: 6969,
          year: 2008,
          authorizedAum: 1182,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1182,
          agreementId: 'RAN077020'
        },
        {
          id: 6506,
          year: 2007,
          authorizedAum: 735,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 735,
          agreementId: 'RAN077020'
        }
      ],
      plans: [],
      livestockIdentifiers: [],
      id: 'RAN077020'
    },
    {
      forestFileId: 'RAN076861',
      agreementStartDate: '2017-01-01T08:00:00.000Z',
      agreementEndDate: '2041-12-31T08:00:00.000Z',
      zoneId: 34,
      agreementExemptionStatusId: 1,
      agreementTypeId: 1,
      zone: {
        id: 34,
        code: 'SPC',
        description: 'South Peace',
        districtId: 9,
        userId: 18,
        district: {
          id: 9,
          code: 'DCP',
          description: ''
        },
        user: {
          id: 18,
          username: 'marcamer',
          clientId: null,
          givenName: 'Marika',
          familyName: 'Cameron',
          email: 'marika.cameron@gov.bc.ca',
          phoneNumber: null,
          active: false,
          lastLoginAt: null,
          roles: []
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
          id: '00054268',
          locationCode: '01',
          name: 'ELLINGSON, JOHN ANDREW',
          clientTypeCode: 'A',
          startDate: null
        },
        {
          id: '00140214',
          locationCode: '00',
          name: 'ELLINGSON, BONNIE MARY',
          clientTypeCode: 'B',
          startDate: null
        }
      ],
      usage: [
        {
          id: 24077,
          year: 2041,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24076,
          year: 2040,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24075,
          year: 2039,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24074,
          year: 2038,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24073,
          year: 2037,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24072,
          year: 2036,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24071,
          year: 2035,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24070,
          year: 2034,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24069,
          year: 2033,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24068,
          year: 2032,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24067,
          year: 2031,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24066,
          year: 2030,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24065,
          year: 2029,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24064,
          year: 2028,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24063,
          year: 2027,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24062,
          year: 2026,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24016,
          year: 2025,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24015,
          year: 2024,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24014,
          year: 2023,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24013,
          year: 2022,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24012,
          year: 2021,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24011,
          year: 2020,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24010,
          year: 2019,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24009,
          year: 2018,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 24008,
          year: 2017,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 11745,
          year: 2016,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 11744,
          year: 2015,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 11741,
          year: 2014,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 11743,
          year: 2013,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 6430,
          year: 2012,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 6429,
          year: 2011,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 6428,
          year: 2010,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 6427,
          year: 2009,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 6426,
          year: 2008,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        },
        {
          id: 6425,
          year: 2007,
          authorizedAum: 51,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 51,
          agreementId: 'RAN076861'
        }
      ],
      plans: [],
      livestockIdentifiers: [],
      id: 'RAN076861'
    },
    {
      forestFileId: 'RAN076843',
      agreementStartDate: '2017-01-01T08:00:00.000Z',
      agreementEndDate: '2041-12-31T08:00:00.000Z',
      zoneId: 57,
      agreementExemptionStatusId: 1,
      agreementTypeId: 1,
      zone: {
        id: 57,
        code: 'DOS3',
        description: 'Please update contact and description',
        districtId: 15,
        userId: 34,
        district: {
          id: 15,
          code: 'DOS',
          description: ''
        },
        user: {
          id: 34,
          username: 'rdinwood',
          clientId: null,
          givenName: 'Rob',
          familyName: 'Dinwoodie',
          email: 'rob.dinwoodie@gov.bc.ca',
          phoneNumber: null,
          active: false,
          lastLoginAt: null,
          roles: []
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
          id: '00162356',
          locationCode: '02',
          name: 'CULLIGAN, RYAN MCKNIGHT',
          clientTypeCode: 'A',
          startDate: null
        },
        {
          id: '00045960',
          locationCode: '00',
          name: 'THE NATURE TRUST OF BRITISH COLUMBIA',
          clientTypeCode: 'B',
          startDate: null
        }
      ],
      usage: [
        {
          id: 25443,
          year: 2041,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25442,
          year: 2040,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25441,
          year: 2039,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25440,
          year: 2038,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25439,
          year: 2037,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25438,
          year: 2036,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25437,
          year: 2035,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25436,
          year: 2034,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25435,
          year: 2033,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25434,
          year: 2032,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25433,
          year: 2031,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25432,
          year: 2030,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25431,
          year: 2029,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25430,
          year: 2028,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25429,
          year: 2027,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25428,
          year: 2026,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25427,
          year: 2025,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25426,
          year: 2024,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25425,
          year: 2023,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25424,
          year: 2022,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25423,
          year: 2021,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25422,
          year: 2020,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25421,
          year: 2019,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25420,
          year: 2018,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 25419,
          year: 2017,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 20659,
          year: 2016,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 20100,
          year: 2015,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 16324,
          year: 2014,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 14815,
          year: 2013,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 12539,
          year: 2012,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 499,
          totalAnnualUse: 2482,
          agreementId: 'RAN076843'
        },
        {
          id: 11109,
          year: 2011,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 926,
          totalAnnualUse: 2055,
          agreementId: 'RAN076843'
        },
        {
          id: 9231,
          year: 2010,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 1426,
          totalAnnualUse: 1555,
          agreementId: 'RAN076843'
        },
        {
          id: 7879,
          year: 2009,
          authorizedAum: 2981,
          temporaryIncrease: 0,
          totalNonUse: 2381,
          totalAnnualUse: 600,
          agreementId: 'RAN076843'
        },
        {
          id: 7180,
          year: 2008,
          authorizedAum: 3581,
          temporaryIncrease: 0,
          totalNonUse: 600,
          totalAnnualUse: 2981,
          agreementId: 'RAN076843'
        },
        {
          id: 6519,
          year: 2007,
          authorizedAum: 600,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 600,
          agreementId: 'RAN076843'
        }
      ],
      plans: [],
      livestockIdentifiers: [],
      id: 'RAN076843'
    },
    {
      forestFileId: 'RAN076506',
      agreementStartDate: '2015-01-01T08:00:00.000Z',
      agreementEndDate: '2029-12-31T08:00:00.000Z',
      zoneId: 58,
      agreementExemptionStatusId: 1,
      agreementTypeId: 1,
      zone: {
        id: 58,
        code: 'DOS4',
        description: 'Please update contact and description',
        districtId: 15,
        userId: 35,
        district: {
          id: 15,
          code: 'DOS',
          description: ''
        },
        user: {
          id: 35,
          username: 'scampbe',
          clientId: null,
          givenName: 'Sonya',
          familyName: 'Campbell',
          email: 'sonya.campbell@gov.bc.ca',
          phoneNumber: null,
          active: false,
          lastLoginAt: null,
          roles: []
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
          id: '00053820',
          locationCode: '01',
          name: 'DENNIS, THERESA MYRTLE',
          clientTypeCode: 'A',
          startDate: null
        },
        {
          id: '00068017',
          locationCode: '00',
          name: 'DENNIS, ROBERT KELLY',
          clientTypeCode: 'B',
          startDate: null
        },
        {
          id: '00046398',
          locationCode: '00',
          name: 'DENNIS, ROBERT ',
          clientTypeCode: 'B',
          startDate: null
        }
      ],
      usage: [
        {
          id: 23439,
          year: 2029,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 23438,
          year: 2028,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 23437,
          year: 2027,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 23436,
          year: 2026,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 23435,
          year: 2025,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 23434,
          year: 2024,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 23433,
          year: 2023,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 23432,
          year: 2022,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 23431,
          year: 2021,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 23430,
          year: 2020,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 20657,
          year: 2019,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 20656,
          year: 2018,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 908,
          totalAnnualUse: 240,
          agreementId: 'RAN076506'
        },
        {
          id: 20655,
          year: 2017,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 908,
          totalAnnualUse: 240,
          agreementId: 'RAN076506'
        },
        {
          id: 20654,
          year: 2016,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 1148,
          totalAnnualUse: 0,
          agreementId: 'RAN076506'
        },
        {
          id: 21419,
          year: 2015,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 1148,
          totalAnnualUse: 0,
          agreementId: 'RAN076506'
        },
        {
          id: 16325,
          year: 2014,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        },
        {
          id: 7746,
          year: 2013,
          authorizedAum: 1083,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1083,
          agreementId: 'RAN076506'
        },
        {
          id: 12531,
          year: 2012,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 230,
          totalAnnualUse: 918,
          agreementId: 'RAN076506'
        },
        {
          id: 7745,
          year: 2011,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 365,
          totalAnnualUse: 783,
          agreementId: 'RAN076506'
        },
        {
          id: 9317,
          year: 2010,
          authorizedAum: 1083,
          temporaryIncrease: 0,
          totalNonUse: 307,
          totalAnnualUse: 776,
          agreementId: 'RAN076506'
        },
        {
          id: 7744,
          year: 2009,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 396,
          totalAnnualUse: 752,
          agreementId: 'RAN076506'
        },
        {
          id: 7147,
          year: 2008,
          authorizedAum: 1083,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1083,
          agreementId: 'RAN076506'
        },
        {
          id: 21522,
          year: 2007,
          authorizedAum: 370,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 370,
          agreementId: 'RAN076506'
        },
        {
          id: 7146,
          year: 2006,
          authorizedAum: 1148,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 1148,
          agreementId: 'RAN076506'
        }
      ],
      plans: [],
      livestockIdentifiers: [],
      id: 'RAN076506'
    },
    {
      forestFileId: 'RAN077003',
      agreementStartDate: '2010-01-01T08:00:00.000Z',
      agreementEndDate: '2019-12-31T08:00:00.000Z',
      zoneId: 59,
      agreementExemptionStatusId: 1,
      agreementTypeId: 1,
      zone: {
        id: 59,
        code: 'DOS2',
        description: 'Please update contact and description',
        districtId: 15,
        userId: 36,
        district: {
          id: 15,
          code: 'DOS',
          description: ''
        },
        user: {
          id: 36,
          username: 'hhethering',
          clientId: null,
          givenName: 'Harold',
          familyName: 'Hetherington',
          email: 'harold.hetherington@gov.bc.ca',
          phoneNumber: null,
          active: false,
          lastLoginAt: null,
          roles: []
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
          id: '00024901',
          locationCode: '00',
          name: 'BOPFINGER, WALTER HANS',
          clientTypeCode: 'A',
          startDate: null
        }
      ],
      usage: [
        {
          id: 18599,
          year: 2019,
          authorizedAum: 682,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 682,
          agreementId: 'RAN077003'
        },
        {
          id: 18598,
          year: 2018,
          authorizedAum: 682,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 682,
          agreementId: 'RAN077003'
        },
        {
          id: 18597,
          year: 2017,
          authorizedAum: 682,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 682,
          agreementId: 'RAN077003'
        },
        {
          id: 18596,
          year: 2016,
          authorizedAum: 682,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 682,
          agreementId: 'RAN077003'
        },
        {
          id: 18595,
          year: 2015,
          authorizedAum: 682,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 682,
          agreementId: 'RAN077003'
        },
        {
          id: 8609,
          year: 2014,
          authorizedAum: 682,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 682,
          agreementId: 'RAN077003'
        },
        {
          id: 8608,
          year: 2013,
          authorizedAum: 662,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 662,
          agreementId: 'RAN077003'
        },
        {
          id: 8607,
          year: 2012,
          authorizedAum: 682,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 682,
          agreementId: 'RAN077003'
        },
        {
          id: 8606,
          year: 2011,
          authorizedAum: 662,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 662,
          agreementId: 'RAN077003'
        },
        {
          id: 8605,
          year: 2010,
          authorizedAum: 662,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 662,
          agreementId: 'RAN077003'
        }
      ],
      plans: [],
      livestockIdentifiers: [],
      id: 'RAN077003'
    },
    {
      forestFileId: 'RAN077031',
      agreementStartDate: '2018-01-01T08:00:00.000Z',
      agreementEndDate: '2042-12-31T08:00:00.000Z',
      zoneId: 60,
      agreementExemptionStatusId: 1,
      agreementTypeId: 3,
      zone: {
        id: 60,
        code: 'GLNB',
        description: 'No description available',
        districtId: 11,
        userId: 22,
        district: {
          id: 11,
          code: 'DMH',
          description: ''
        },
        user: {
          id: 22,
          username: 'ebasset',
          clientId: null,
          givenName: 'Eleanor',
          familyName: 'Bassett',
          email: 'eleanor.bassett@gov.bc.ca',
          phoneNumber: null,
          active: false,
          lastLoginAt: null,
          roles: []
        }
      },
      agreementType: {
        id: 3,
        code: 'H01',
        description: 'Haycutting Licence',
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
          id: '00018504',
          locationCode: '00',
          name: 'CANABO CATTLE CO. LTD.',
          clientTypeCode: 'A',
          startDate: null
        }
      ],
      usage: [
        {
          id: 5962,
          year: 2017,
          authorizedAum: 21,
          temporaryIncrease: 0,
          totalNonUse: 21,
          totalAnnualUse: 0,
          agreementId: 'RAN077031'
        },
        {
          id: 5961,
          year: 2016,
          authorizedAum: 21,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 21,
          agreementId: 'RAN077031'
        },
        {
          id: 5960,
          year: 2015,
          authorizedAum: 21,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 21,
          agreementId: 'RAN077031'
        },
        {
          id: 5959,
          year: 2014,
          authorizedAum: 21,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 21,
          agreementId: 'RAN077031'
        },
        {
          id: 5958,
          year: 2013,
          authorizedAum: 21,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 21,
          agreementId: 'RAN077031'
        },
        {
          id: 5957,
          year: 2012,
          authorizedAum: 21,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 21,
          agreementId: 'RAN077031'
        },
        {
          id: 5956,
          year: 2011,
          authorizedAum: 21,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 21,
          agreementId: 'RAN077031'
        },
        {
          id: 5955,
          year: 2010,
          authorizedAum: 21,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 21,
          agreementId: 'RAN077031'
        },
        {
          id: 5954,
          year: 2009,
          authorizedAum: 21,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 21,
          agreementId: 'RAN077031'
        },
        {
          id: 5944,
          year: 2008,
          authorizedAum: 21,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 21,
          agreementId: 'RAN077031'
        }
      ],
      plans: [
        {
          agreementId: 'RAN077031',
          altBusinessName: null,
          amendmentTypeId: null,
          createdAt: '2018-11-14T17:46:18.101Z',
          creator: {
            id: 2,
            username: 'rangeadmin',
            clientId: null,
            givenName: 'Range',
            familyName: 'Admin'
          },
          creatorId: 2,
          effectiveAt: null,
          extension: null,
          id: 1,
          notes: null,
          planEndDate: '2022-12-30T08:00:00.000Z',
          planStartDate: '2019-01-21T08:00:00.000Z',
          rangeName: "Kyub's Range",
          status: { id: 1, code: 'C', name: 'Created', active: true },
          statusId: 1,
          submittedAt: null,
          updatedAt: '2018-11-14T17:46:18.101Z',
          uploaded: true
        }
      ],
      livestockIdentifiers: [],
      id: 'RAN077031'
    },
    {
      forestFileId: 'RAN077046',
      agreementStartDate: '2003-01-01T08:00:00.000Z',
      agreementEndDate: '2022-12-31T08:00:00.000Z',
      zoneId: 61,
      agreementExemptionStatusId: 1,
      agreementTypeId: 1,
      zone: {
        id: 61,
        code: 'PRIN',
        description: 'Prince George',
        districtId: 8,
        userId: 33,
        district: {
          id: 8,
          code: 'DPG',
          description: ''
        },
        user: {
          id: 33,
          username: 'pgyug',
          clientId: null,
          givenName: 'Philip',
          familyName: 'Gyug',
          email: 'philip.gyug@gov.bc.ca',
          phoneNumber: null,
          active: false,
          lastLoginAt: null,
          roles: []
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
          id: '00154666',
          locationCode: '00',
          name: 'VAN DER MERWE, PETRUS JACOBUS',
          clientTypeCode: 'A',
          startDate: null
        }
      ],
      usage: [
        {
          id: 13936,
          year: 2021,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 25068,
          year: 2020,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 13935,
          year: 2019,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 13934,
          year: 2018,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 13933,
          year: 2017,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 13932,
          year: 2016,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 13931,
          year: 2015,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 13930,
          year: 2014,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 25067,
          year: 2013,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 12364,
          year: 2012,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 10296,
          year: 2011,
          authorizedAum: 862,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 862,
          agreementId: 'RAN077046'
        },
        {
          id: 9254,
          year: 2010,
          authorizedAum: 362,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 362,
          agreementId: 'RAN077046'
        },
        {
          id: 7728,
          year: 2009,
          authorizedAum: 362,
          temporaryIncrease: 0,
          totalNonUse: 0,
          totalAnnualUse: 362,
          agreementId: 'RAN077046'
        },
        {
          id: 21393,
          year: 2008,
          authorizedAum: 300,
          temporaryIncrease: 0,
          totalNonUse: 300,
          totalAnnualUse: 0,
          agreementId: 'RAN077046'
        }
      ],
      plans: [],
      livestockIdentifiers: [],
      id: 'RAN077046'
    }
  ]
}
export default paginatedMockAgreements
