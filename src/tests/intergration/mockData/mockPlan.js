/* eslint-disable quotes, comma-dangle */
const mockPlanWithAgreement = {
    "id": 4,
    "rangeName": "Bad Range",
    "planStartDate": "2000-02-25T08:00:00.000Z",
    "planEndDate": "2001-04-12T07:00:00.000Z",
    "notes": null,
    "altBusinessName": null,
    "agreementId": "RAN073906",
    "statusId": 6,
    "uploaded": true,
    "amendmentTypeId": null,
    "createdAt": "2018-11-14T20:58:24.912Z",
    "updatedAt": "2018-11-14T20:58:26.223Z",
    "effectiveAt": null,
    "submittedAt": null,
    "creatorId": 1,
    "status": {
        "id": 6,
        "code": "SD",
        "name": "Staff Draft",
        "active": true
    },
    "extension": null,
    "creator": {
        "id": 1,
        "username": "rangestaff",
        "clientId": null,
        "givenName": "Range",
        "familyName": "Staff",
        "email": "amir+1@freshworks.io",
        "phoneNumber": null,
        "active": true,
        "lastLoginAt": "2018-11-14T20:58:29.865Z",
        "roles": []
    },
    "pastures": [
        {
            "id": 1,
            "name": "crown",
            "allowableAum": null,
            "graceDays": 3,
            "pldPercent": null,
            "notes": null,
            "planId": 4,
            "plantCommunities": []
        }
    ],
    "grazingSchedules": [
        {
            "id": 1,
            "year": 2000,
            "narative": null,
            "planId": 4,
            "grazingScheduleEntries": [
                {
                    "id": 1,
                    "graceDays": 3,
                    "livestockCount": 30,
                    "dateIn": "2000-03-21T08:00:00.000Z",
                    "dateOut": "2000-04-29T07:00:00.000Z",
                    "pastureId": 1,
                    "livestockTypeId": 5,
                    "grazingScheduleId": 1,
                    "livestockType": {
                        "id": 5,
                        "name": "Sheep",
                        "auFactor": 0.2,
                        "active": true
                    }
                }
            ]
        }
    ],
    "ministerIssues": [
        {
            "id": 1,
            "detail": "The details of this issue are detailed here",
            "objective": "This issue has no objectives ",
            "identified": true,
            "issueTypeId": 4,
            "otherTypeName": null,
            "planId": 4,
            "ministerIssueType": {
                "id": 4,
                "name": "Fish - Wildlife",
                "active": true
            },
            "ministerIssueActions": [
                {
                    "id": 1,
                    "detail": "Threw salt on it",
                    "actionTypeId": 3,
                    "issueId": 1,
                    "ministerIssueActionType": {
                        "id": 3,
                        "name": "Salting",
                        "active": true
                    }
                }
            ],
            "pastures": [
                1
            ]
        }
    ],
    "planStatusHistory": [],
    "confirmations": [],
    "invasivePlantChecklist": {
        "id": 4,
        "planId": 4,
        "equipmentAndVehiclesParking": false,
        "beginInUninfestedArea": true,
        "undercarrigesInspected": false,
        "revegetate": false,
        "other": "Other requirement example entered here"
    },
    "additionalRequirements": [],
    "managementConsiderations": [],
    "agreement": {
        "forestFileId": "RAN073906",
        "agreementStartDate": "1999-01-01T08:00:00.000Z",
        "agreementEndDate": "2018-12-31T08:00:00.000Z",
        "zoneId": 64,
        "agreementExemptionStatusId": 1,
        "agreementTypeId": 1,
        "zone": {
            "id": 64,
            "code": "GLNB",
            "description": "No description available",
            "districtId": 11,
            "userId": 1,
            "district": {
                "id": 11,
                "code": "DMH",
                "description": ""
            },
            "user": {
                "id": 1,
                "username": "rangestaff",
                "clientId": null,
                "givenName": "Range",
                "familyName": "Staff",
                "email": "amir+1@freshworks.io",
                "phoneNumber": null,
                "active": true,
                "lastLoginAt": "2018-11-14T20:58:29.865Z",
                "roles": []
            }
        },
        "agreementType": {
            "id": 1,
            "code": "E01",
            "description": "Grazing Licence",
            "active": true
        },
        "agreementExemptionStatus": {
            "id": 1,
            "code": "N",
            "description": "Not Exempt",
            "active": true
        },
        "clients": [
            {
                "id": "00176783",
                "locationCode": "00",
                "name": "ALLEN, SHARON MARIE",
                "clientTypeCode": "A",
                "startDate": null,
                "endDate": null
            }
        ],
        "usage": [
            {
                "id": 607,
                "year": 1999,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 608,
                "year": 2000,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 609,
                "year": 2001,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 610,
                "year": 2002,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 611,
                "year": 2003,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 612,
                "year": 2004,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 613,
                "year": 2005,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 614,
                "year": 2006,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 615,
                "year": 2007,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 616,
                "year": 2008,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 7455,
                "year": 2009,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 7489,
                "year": 2010,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 7490,
                "year": 2011,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 7491,
                "year": 2012,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 7492,
                "year": 2013,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 7493,
                "year": 2014,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 7494,
                "year": 2015,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 7495,
                "year": 2016,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 7496,
                "year": 2017,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            },
            {
                "id": 7497,
                "year": 2018,
                "authorizedAum": 8,
                "temporaryIncrease": 0,
                "totalNonUse": 0,
                "totalAnnualUse": 8,
                "agreementId": "RAN073906"
            }
        ],
        "livestockIdentifiers": [],
        "id": "RAN073906"
    }
};
export default mockPlanWithAgreement;
