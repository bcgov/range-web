export const getMockAgreement = number => (
  {
    id: `RAN072844${number}`,
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
    "clients" : [],
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
    ]
  }
)

export const getMockAgreements = (length) => {
  const array = Array.from(new Array(length), (x,i) => i);
  return array.map(number => getMockAgreement(number + 1));
}
