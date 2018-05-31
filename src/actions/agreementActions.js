//
// MyRA
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Kyubin Han.
//

import {
  success,
  request,
  successPaginated,
  error,
} from '../actions/genericActions';
import { AGREEMENTS, RANGE_USE_PLAN } from '../constants/reducerTypes';
import { SEARCH_AGREEMENTS_ENDPOINT, GET_RUP_ENDPOINT } from '../constants/api';
import axios from '../handlers/axios';

export const getAgreements = ({ term = '', page = 1, limit = 10 }) => (dispatch) => {
  dispatch(request(AGREEMENTS));
  const makeRequest = async () => {
    try {
      const config = {
        params: {
          term,
          page,
          limit,
        },
      };
      const response = await axios.get(SEARCH_AGREEMENTS_ENDPOINT, config);
      const { agreements, currentPage, totalPages } = response.data;
      dispatch(successPaginated(AGREEMENTS, agreements, currentPage, totalPages));
    } catch (err) {
      dispatch(error(AGREEMENTS, err));
      throw err;
    }
  };
  makeRequest();
};

export const getRangeUsePlan = planId => (dispatch) => {
  dispatch(request(RANGE_USE_PLAN));
  const makeRequest = async () => {
    try {
      const response = await axios.get(GET_RUP_ENDPOINT(planId));
      const rangeUsePlan = response.data;

      dispatch(success(RANGE_USE_PLAN, rangeUsePlan));
    } catch (err) {
      dispatch(error(RANGE_USE_PLAN, err));
      throw err;
    }
  };
  makeRequest();
};
