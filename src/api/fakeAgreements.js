const paginatedFakeAgreements = {
  "perPage": 10,
  "currentPage": 1,
  "totalItems": 1511,
  "totalPages": 152,
  "agreements": [
    {
      "forestFileId": "RAN075974",
      "agreementStartDate": "2014-01-01T08:00:00.000Z",
      "agreementEndDate": "2023-12-31T08:00:00.000Z",
      "zoneId": 34,
      "agreementExemptionStatusId": 1,
      "agreementTypeId": 1,
      // "zone": {
      //     "id": 34,
      //     "code": "SPC",
      //     "description": "South Peace",
      //     "districtId": 9,
      //     "userId": 11,
      //     "district": {
      //         "id": 9,
      //         "code": "DCP",
      //         "description": ""
      //     },
      //     "user": {
      //         "id": 11,
      //         "username": "marcamer",
      //         "clientId": null,
      //         "givenName": "Marika",
      //         "familyName": "Cameron",
      //         "email": "marika.cameron@gov.bc.ca",
      //         "phoneNumber": null,
      //         "active": false,
      //         "lastLoginAt": null,
      //         "roles": []
      //     }
      // },
      // "agreementType": {
      //     "id": 1,
      //     "code": "E01",
      //     "description": "Grazing Licence",
      //     "active": true
      // },
      // "agreementExemptionStatus": {
      //     "id": 1,
      //     "code": "N",
      //     "description": "Not Exempt",
      //     "active": true
      // },
      // "clients": [
      //     {
      //         "id": "00065458",
      //         "locationCode": "01",
      //         "name": "MULVAHILL, LANCE ",
      //         "clientTypeCode": "A",
      //         "startDate": "2015-04-30T07:00:00.000Z"
      //     },
      //     {
      //         "id": "00065457",
      //         "locationCode": "00",
      //         "name": "MULVAHILL, MICHAEL JOHN",
      //         "clientTypeCode": "B",
      //         "startDate": "2015-04-30T07:00:00.000Z"
      //     }
      // ],
      // "usage": [
      //     {
      //         "id": 23051,
      //         "year": 2023,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 0,
      //         "totalAnnualUse": 85
      //     },
      //     {
      //         "id": 15003,
      //         "year": 2022,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 0,
      //         "totalAnnualUse": 85
      //     },
      //     {
      //         "id": 15002,
      //         "year": 2021,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 0,
      //         "totalAnnualUse": 85
      //     },
      //     {
      //         "id": 15001,
      //         "year": 2020,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 0,
      //         "totalAnnualUse": 85
      //     },
      //     {
      //         "id": 15000,
      //         "year": 2019,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 8,
      //         "totalAnnualUse": 77
      //     },
      //     {
      //         "id": 14999,
      //         "year": 2018,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 21,
      //         "totalAnnualUse": 64
      //     },
      //     {
      //         "id": 14998,
      //         "year": 2017,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 42,
      //         "totalAnnualUse": 43
      //     },
      //     {
      //         "id": 14997,
      //         "year": 2016,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 85,
      //         "totalAnnualUse": 0
      //     },
      //     {
      //         "id": 14996,
      //         "year": 2015,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 85,
      //         "totalAnnualUse": 0
      //     },
      //     {
      //         "id": 14995,
      //         "year": 2014,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 3,
      //         "totalAnnualUse": 82
      //     },
      //     {
      //         "id": 9428,
      //         "year": 2013,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 3,
      //         "totalAnnualUse": 82
      //     },
      //     {
      //         "id": 9427,
      //         "year": 2012,
      //         "authorizedAum": 85,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 0,
      //         "totalAnnualUse": 85
      //     },
      //     {
      //         "id": 9425,
      //         "year": 2011,
      //         "authorizedAum": 606,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 525,
      //         "totalAnnualUse": 81
      //     },
      //     {
      //         "id": 3900,
      //         "year": 2010,
      //         "authorizedAum": 606,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 525,
      //         "totalAnnualUse": 81
      //     },
      //     {
      //         "id": 3899,
      //         "year": 2009,
      //         "authorizedAum": 606,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 331,
      //         "totalAnnualUse": 275
      //     },
      //     {
      //         "id": 3898,
      //         "year": 2008,
      //         "authorizedAum": 606,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 0,
      //         "totalAnnualUse": 606
      //     },
      //     {
      //         "id": 3897,
      //         "year": 2007,
      //         "authorizedAum": 285,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 0,
      //         "totalAnnualUse": 285
      //     },
      //     {
      //         "id": 3896,
      //         "year": 2006,
      //         "authorizedAum": 606,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 0,
      //         "totalAnnualUse": 606
      //     },
      //     {
      //         "id": 3895,
      //         "year": 2005,
      //         "authorizedAum": 495,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 0,
      //         "totalAnnualUse": 495
      //     },
      //     {
      //         "id": 3325,
      //         "year": 2004,
      //         "authorizedAum": 495,
      //         "temporaryIncrease": 0,
      //         "totalNonUse": 0,
      //         "totalAnnualUse": 495
      //     }
      // ],
      // "plans": [],
      // "livestockIdentifiers": [],
      "id": "RAN075974"
    },
  ]
};
export default paginatedFakeAgreements;
