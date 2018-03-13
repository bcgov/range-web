import {
  success,
  request,
  successPaginated,
  error,
} from '../actions/genericActions';
import { TENURE_AGREEMENTS, RANGE_USE_PLAN } from '../constants/reducerTypes';
import { BASE_URL, AGREEMENTS } from '../constants/api';
import axios from '../handlers/axios';

const agreements = [
  {
      "id": 2,
      "agreementId": "RAN123474",
      "rangeName": "Cow Pie Range",
      "agreementStartDate": "2018-03-09T22:11:43.391Z",
      "agreementEndDate": "2043-03-03T22:11:43.391Z",
      "planStartDate": "2019-03-09T22:11:43.391Z",
      "planEndDate": "2020-03-09T22:11:43.391Z",
      "exemptionStatus": null,
      "status": null,
      "notes": null,
      "createdAt": "2018-03-09T22:11:43.409Z",
      "updatedAt": "2018-03-09T22:11:43.409Z",
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
  },
  {
      "id": 3,
      "agreementId": "RAN123474",
      "rangeName": "Big Bad Bull Range",
      "agreementStartDate": "2018-03-09T22:12:00.742Z",
      "agreementEndDate": "2043-03-03T22:12:00.742Z",
      "planStartDate": "2019-03-09T22:11:43.391Z",
      "planEndDate": "2020-03-09T22:11:43.391Z",
      "exemptionStatus": null,
      "status": null,
      "notes": null,
      "createdAt": "2018-03-09T22:12:00.759Z",
      "updatedAt": "2018-03-09T22:12:00.759Z",
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
  },
  {
      "id": 1,
      "agreementId": "RAN123499",
      "rangeName": "Hello World",
      "agreementStartDate": "2018-03-09T22:10:29.145Z",
      "agreementEndDate": "2043-03-03T22:10:29.145Z",
      "planStartDate": "2019-03-09T22:11:43.391Z",
      "planEndDate": "2020-03-09T22:11:43.391Z",
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
];

export const searchTenureAgreements = (requestData) => (dispatch) => {
  dispatch(request(TENURE_AGREEMENTS));

  axios.get(BASE_URL + AGREEMENTS)
    .then(response => {
      console.log(response);
      const agreements = response.data;
      dispatch(success(TENURE_AGREEMENTS, agreements));
    }).catch(err => {
      console.log(err);
      dispatch(success(TENURE_AGREEMENTS, agreements));
    });

  // setTimeout(() => {
  //   dispatch(success(TENURE_AGREEMENTS, agreements));
  // }, 1000);
};

export const getRangeUsePlan = (id) => (dispatch) => {
  dispatch(request(RANGE_USE_PLAN));

  axios.get(`${BASE_URL}${AGREEMENTS}/${id}`)
    .then(response => {
      console.log(response);
      const rangeUsePlan = response.data;
      dispatch(success(RANGE_USE_PLAN, rangeUsePlan));
    })
    .catch(err => {
      console.log(err);
      const rangeUsePlan = agreements.find(a => a.id == id);
      dispatch(success(RANGE_USE_PLAN, rangeUsePlan));
    });

  // const rangeUsePlan = agreements.find(a => a.id == id);
  // setTimeout(() => {
  //   dispatch(success(RANGE_USE_PLAN, rangeUsePlan));
  // }, 500);
}