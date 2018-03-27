export const getMockRangeUsePlan = (number) => (
  {
    "id": "RAN072848",
    "agreementStartDate": "2016-01-01T08:00:00.000Z",
    "agreementEndDate": "2040-12-31T08:00:00.000Z",
    "typeId": 1,
    "exemptionStatusId": 1,
    "createdAt": "2018-03-24T03:15:37.069Z",
    "updatedAt": "2018-03-27T16:32:42.330Z",
    "primary_agreement_holder_id": null,
    "agreement_type_id": 1,
    "agreement_exemption_status_id": 1,
    "zone_id": 23,
    "agreementExemptionStatus": {
        "id": 1,
        "code": "N",
        "description": "Not Exempt"
    },
    "zone": {
        "id": 23,
        "code": "MER2",
        "description": "Merritt Zone ",
        "contactName": "Philip Gyug",
        "contactPhoneNumber": null,
        "contactEmail": null,
        "districtId": 4,
        "createdAt": "2018-03-24T03:13:17.264Z",
        "updatedAt": "2018-03-24T03:15:11.644Z",
        "district": {
            "id": 4,
            "code": "DCS",
            "description": "",
            "createdAt": "2018-03-24T03:13:17.199Z",
            "updatedAt": "2018-03-24T03:13:17.199Z"
        }
    },
    "livestockIdentifiers": [],
    "plans": [
        {
            "id": 12,
            "rangeName": "ag1",
            "planStartDate": null,
            "planEndDate": null,
            "notes": null,
            "statusId": 1,
            "agreementId": "RAN072848",
            "extensionId": null,
            "createdAt": "2018-03-27T16:43:53.513Z",
            "updatedAt": "2018-03-27T16:43:53.537Z",
            "agreement_id": "RAN072848",
            "status": {
                "id": 1,
                "code": "S",
                "name": "Submitted",
                "active": true,
                "createdAt": "2018-03-24T03:13:18.287Z",
                "updatedAt": "2018-03-24T03:13:18.287Z"
            },
            "pastures": [],
            "grazingSchedules": []
        },
        {
            "id": 13,
            "rangeName": "Random Range",
            "planStartDate": "2018-03-27T00:03:13.261Z",
            "planEndDate": "2022-03-27T00:03:13.261Z",
            "notes": null,
            "statusId": 3,
            "agreementId": "RAN072848",
            "extensionId": null,
            "createdAt": "2018-03-27T00:03:13.261Z",
            "updatedAt": "2018-03-27T16:58:56.665Z",
            "agreement_id": "RAN072848",
            "status": {
                "id": 3,
                "code": "P",
                "name": "Pending",
                "active": true,
                "createdAt": "2018-03-24T03:13:18.287Z",
                "updatedAt": "2018-03-24T03:13:18.287Z"
            },
            "pastures": [
                {
                    "id": 3,
                    "name": "Hellow",
                    "allowableAum": 0,
                    "graceDays": 0,
                    "pldPercent": 0,
                    "notes": null,
                    "planId": 13,
                    "createdAt": "2018-03-27T16:55:28.805Z",
                    "updatedAt": "2018-03-27T16:55:28.816Z"
                }
            ],
            "grazingSchedules": []
        },
        {
            "id": 5,
            "rangeName": "Random Range",
            "planStartDate": "2018-03-27T00:03:13.261Z",
            "planEndDate": "2022-03-27T00:03:13.261Z",
            "notes": null,
            "statusId": 1,
            "agreementId": "RAN072848",
            "extensionId": null,
            "createdAt": "2018-03-27T00:03:13.261Z",
            "updatedAt": "2018-03-27T16:07:36.149Z",
            "agreement_id": "RAN072848",
            "status": {
                "id": 1,
                "code": "S",
                "name": "Submitted",
                "active": true,
                "createdAt": "2018-03-24T03:13:18.287Z",
                "updatedAt": "2018-03-24T03:13:18.287Z"
            },
            "pastures": [],
            "grazingSchedules": []
        },
        {
            "id": 6,
            "rangeName": "ag1",
            "planStartDate": null,
            "planEndDate": null,
            "notes": null,
            "statusId": 1,
            "agreementId": "RAN072848",
            "extensionId": null,
            "createdAt": "2018-03-27T16:17:49.085Z",
            "updatedAt": "2018-03-27T16:17:49.141Z",
            "agreement_id": "RAN072848",
            "status": {
                "id": 1,
                "code": "S",
                "name": "Submitted",
                "active": true,
                "createdAt": "2018-03-24T03:13:18.287Z",
                "updatedAt": "2018-03-24T03:13:18.287Z"
            },
            "pastures": [],
            "grazingSchedules": []
        }
    ],
    "primaryAgreementHolder": null,
    "usage": [
        {
            "id": 9,
            "year": "1996",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:19:09.118Z",
            "updatedAt": "2018-03-24T03:19:09.118Z"
        },
        {
            "id": 10,
            "year": "1997",
            "authorizedAum": 185,
            "temporaryIncrease": 0,
            "totalNonUse": 168,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:19:09.235Z",
            "updatedAt": "2018-03-24T03:19:09.235Z"
        },
        {
            "id": 11,
            "year": "1999",
            "authorizedAum": 185,
            "temporaryIncrease": 0,
            "totalNonUse": 168,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:19:09.322Z",
            "updatedAt": "2018-03-24T03:19:09.322Z"
        },
        {
            "id": 12,
            "year": "2000",
            "authorizedAum": 185,
            "temporaryIncrease": 0,
            "totalNonUse": 168,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:19:09.390Z",
            "updatedAt": "2018-03-24T03:19:09.390Z"
        },
        {
            "id": 13,
            "year": "2001",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:19:09.459Z",
            "updatedAt": "2018-03-24T03:19:09.459Z"
        },
        {
            "id": 14,
            "year": "2002",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:19:09.545Z",
            "updatedAt": "2018-03-24T03:19:09.545Z"
        },
        {
            "id": 15,
            "year": "2003",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:19:09.636Z",
            "updatedAt": "2018-03-24T03:19:09.636Z"
        },
        {
            "id": 2896,
            "year": "2004",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:24:00.363Z",
            "updatedAt": "2018-03-24T03:24:00.363Z"
        },
        {
            "id": 5009,
            "year": "2006",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:27:35.540Z",
            "updatedAt": "2018-03-24T03:27:35.540Z"
        },
        {
            "id": 6111,
            "year": "2007",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:29:38.448Z",
            "updatedAt": "2018-03-24T03:29:38.448Z"
        },
        {
            "id": 7160,
            "year": "2008",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:31:19.846Z",
            "updatedAt": "2018-03-24T03:31:19.846Z"
        },
        {
            "id": 7587,
            "year": "2009",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:32:04.953Z",
            "updatedAt": "2018-03-24T03:32:04.953Z"
        },
        {
            "id": 9066,
            "year": "2010",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:34:48.081Z",
            "updatedAt": "2018-03-24T03:34:48.081Z"
        },
        {
            "id": 10239,
            "year": "2011",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:38:48.294Z",
            "updatedAt": "2018-03-24T03:38:48.294Z"
        },
        {
            "id": 12299,
            "year": "2012",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:42:24.913Z",
            "updatedAt": "2018-03-24T03:42:24.913Z"
        },
        {
            "id": 15971,
            "year": "2015",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:49:26.515Z",
            "updatedAt": "2018-03-24T03:49:26.515Z"
        },
        {
            "id": 15973,
            "year": "2014",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:49:26.722Z",
            "updatedAt": "2018-03-24T03:49:26.722Z"
        },
        {
            "id": 17712,
            "year": "2016",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:52:19.204Z",
            "updatedAt": "2018-03-24T03:52:19.204Z"
        },
        {
            "id": 17769,
            "year": "2017",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:52:25.688Z",
            "updatedAt": "2018-03-24T03:52:25.688Z"
        },
        {
            "id": 17770,
            "year": "2018",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:52:25.751Z",
            "updatedAt": "2018-03-24T03:52:25.751Z"
        },
        {
            "id": 17771,
            "year": "2019",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:52:25.816Z",
            "updatedAt": "2018-03-24T03:52:25.816Z"
        },
        {
            "id": 17772,
            "year": "2020",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:52:25.890Z",
            "updatedAt": "2018-03-24T03:52:25.890Z"
        },
        {
            "id": 17773,
            "year": "2021",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:52:25.960Z",
            "updatedAt": "2018-03-24T03:52:25.960Z"
        },
        {
            "id": 17774,
            "year": "2022",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:52:26.039Z",
            "updatedAt": "2018-03-24T03:52:26.039Z"
        },
        {
            "id": 17775,
            "year": "2023",
            "authorizedAum": 17,
            "temporaryIncrease": 0,
            "totalNonUse": 0,
            "totalAnnualUse": 17,
            "agreementId": "RAN072848",
            "createdAt": "2018-03-24T03:52:26.102Z",
            "updatedAt": "2018-03-24T03:52:26.102Z"
        }
    ]
  }
)

export const getMockRangeUsePlans = (length) => {
  const array = Array.from(new Array(length), (x,i) => i);
  return array.map(number => getMockRangeUsePlan(number + 1));
}
