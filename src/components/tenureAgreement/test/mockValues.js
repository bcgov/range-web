export const getMockRangeUsePlan = (number) => (
  // {
  //   id: `RAN07123${number}`,
  //   number,
  //   status: number/3 <= 1 ? "Completed" : "Pending",
  //   region: `Victoria Ranch ${number}`,
  //   tenureHolder: {
  //     name: number%2 === 0 ? "Han Solo" : "Luke Skywalker"
  //   },
  //   rangeOfficer: {
  //     name: number%2 === 0 ? "Leia Organa" : "Obi-Wan Kenobi"
  //   }
  // }
  {
    "id": 1,
    "agreementId": "RAN123499",
    "rangeName": "Hello World",
    "agreementStartDate": "2018-03-09T22:10:29.145Z",
    "agreementEndDate": "2043-03-03T22:10:29.145Z",
    "planStartDate": null,
    "planEndDate": null,
    "exemptionStatus": null,
    "status": null,
    "notes": null,
    "createdAt": "2018-03-09T22:10:29.162Z",
    "updatedAt": "2018-03-09T22:10:29.162Z",
    "zone": {
        "id": 6,
        "code": "BEAV",
        "description": "Big and Beaver Livestock",
        "districtId": 1,
        "createdAt": "2018-03-09T22:09:56.068Z",
        "updatedAt": "2018-03-09T22:09:56.068Z",
        "district": {
            "id": 1,
            "code": "DCC",
            "description": "",
            "createdAt": "2018-03-09T22:09:55.952Z",
            "updatedAt": "2018-03-09T22:09:55.952Z"
        }
    }
  }
)

export const getMockRangeUsePlans = (length) => {
  const array = Array.from(new Array(length), (x,i) => i);
  return array.map(number => getMockRangeUsePlan(number + 1));
}
