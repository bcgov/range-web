/* eslint-disable quotes, comma-dangle */
const mockReference = {
  "AGREEMENT_TYPE": [
      {
          "id": 1,
          "code": "E01",
          "description": "Grazing Licence",
          "active": true
      },
      {
          "id": 2,
          "code": "E02",
          "description": "Grazing Permit",
          "active": true
      },
      {
          "id": 3,
          "code": "H01",
          "description": "Haycutting Licence",
          "active": true
      },
      {
          "id": 4,
          "code": "H02",
          "description": "Haycutting Permit",
          "active": true
      }
  ],
  "AGREEMENT_EXEMPTION_STATUS": [
      {
          "id": 1,
          "code": "N",
          "description": "Not Exempt",
          "active": true
      },
      {
          "id": 2,
          "code": "PA",
          "description": "Preparing and Obtaining Approval",
          "active": true
      },
      {
          "id": 3,
          "code": "OA",
          "description": "Obtaining Approval",
          "active": true
      }
  ],
  "LIVESTOCK_TYPE": [
      {
          "id": 1,
          "name": "Cow with Calf",
          "auFactor": 1,
          "active": true
      },
      {
          "id": 2,
          "name": "Bull",
          "auFactor": 1.5,
          "active": true
      },
      {
          "id": 3,
          "name": "Yearling",
          "auFactor": 0.7,
          "active": true
      },
      {
          "id": 4,
          "name": "Horse",
          "auFactor": 1.25,
          "active": true
      },
      {
          "id": 5,
          "name": "Sheep",
          "auFactor": 0.2,
          "active": true
      },
      {
          "id": 6,
          "name": "Alpaca",
          "auFactor": 0.1,
          "active": true
      },
      {
          "id": 7,
          "name": "Ass",
          "auFactor": 1.25,
          "active": true
      },
      {
          "id": 8,
          "name": "Goat",
          "auFactor": 0.2,
          "active": true
      },
      {
          "id": 9,
          "name": "Llama",
          "auFactor": 0.2,
          "active": true
      },
      {
          "id": 10,
          "name": "Mule",
          "auFactor": 1.25,
          "active": true
      }
  ],
  "PLAN_STATUS": [
      {
          "id": 1,
          "code": "C",
          "name": "Created",
          "active": true
      },
      {
          "id": 2,
          "code": "O",
          "name": "Completed",
          "active": true
      },
      {
          "id": 3,
          "code": "P",
          "name": "Pending",
          "active": true
      },
      {
          "id": 4,
          "code": "D",
          "name": "Draft",
          "active": true
      },
      {
          "id": 5,
          "code": "R",
          "name": "Change Requested",
          "active": true
      }
  ],
  "CLIENT_TYPE": [
      {
          "id": 1,
          "code": "A",
          "description": "Licensee",
          "active": true
      },
      {
          "id": 2,
          "code": "B",
          "description": "Joint Venture/Partner",
          "active": true
      }
  ],
  "LIVESTOCK_IDENTIFIER_TYPE": [
      {
          "id": 1,
          "description": "Brand",
          "active": true
      },
      {
          "id": 2,
          "description": "Tag",
          "active": true
      }
  ],
  "MINISTER_ISSUE_ACTION_TYPE": [
      {
          "id": 1,
          "name": "Herding",
          "active": true
      },
      {
          "id": 2,
          "name": "Livestock Variables",
          "active": true
      },
      {
          "id": 3,
          "name": "Salting",
          "active": true
      },
      {
          "id": 4,
          "name": "Supplemental Feeding",
          "active": true
      },
      {
          "id": 5,
          "name": "Timing",
          "active": true
      },
      {
          "id": 6,
          "name": "Other",
          "active": true
      }
  ],
  "MINISTER_ISSUE_TYPE": [
      {
          "id": 1,
          "name": "Community Watershed",
          "active": true
      },
      {
          "id": 2,
          "name": "Conservation Areas",
          "active": true
      },
      {
          "id": 3,
          "name": "First Nations Values",
          "active": true
      },
      {
          "id": 4,
          "name": "Fish - Wildlife",
          "active": true
      },
      {
          "id": 5,
          "name": "Livestock Distribution",
          "active": true
      },
      {
          "id": 6,
          "name": "Rangeland Health",
          "active": true
      },
      {
          "id": 7,
          "name": "Recreation - Visual",
          "active": true
      },
      {
          "id": 8,
          "name": "Riparian",
          "active": true
      },
      {
          "id": 9,
          "name": "Other",
          "active": true
      }
  ]
};
export default mockReference;
