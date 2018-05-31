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
  error,
} from '../actions/genericActions';
import { UPDATE_RUP_STATUS_SUCCESS, UPDATE_RUP_ZONE_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import {
  UPDATE_RUP_STATUS,
  UPDATE_RUP_ZONE,
  GET_PDF,
  UPDATE_RUP_SCHEDULE,
  CREATE_RUP_SCHEDULE,
  DELETE_SCHEUDLE,
  DELETE_SCHEUDLE_ENTRY,
} from '../constants/reducerTypes';
import {
  UPDATE_RUP_STATUS_ENDPOINT,
  UPDATE_RUP_ZONE_ENDPOINT,
  GET_RUP_PDF_ENDPOINT,
  CREATE_RUP_SCHEDULE_ENDPOINT,
  UPDATE_RUP_SCHEDULE_ENDPOINT,
  DELETE_RUP_SCHEDULE_ENDPOINT,
  DELETE_RUP_SCHEDULE_ENTRY_ENDPOINT,
} from '../constants/api';
import axios from '../handlers/axios';

export const updateRupStatus = ({ planId, statusId }, shouldToast = true) => (dispatch) => {
  dispatch(request(UPDATE_RUP_STATUS));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        UPDATE_RUP_STATUS_ENDPOINT(planId),
        { statusId },
      );
      dispatch(success(UPDATE_RUP_STATUS, response.data));
      if (shouldToast) {
        dispatch(toastSuccessMessage(UPDATE_RUP_STATUS_SUCCESS));
      }
      return response.data;
    } catch (err) {
      dispatch(error(UPDATE_RUP_STATUS, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const updateRupZone = ({ agreementId, zoneId }) => (dispatch) => {
  dispatch(request(UPDATE_RUP_ZONE));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        UPDATE_RUP_ZONE_ENDPOINT(agreementId),
        { zoneId },
      );
      dispatch(success(UPDATE_RUP_ZONE, response.data));
      dispatch(toastSuccessMessage(UPDATE_RUP_ZONE_SUCCESS));
      return response.data;
    } catch (err) {
      dispatch(error(UPDATE_RUP_ZONE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };

  return makeRequest();
};

export const getRupPDF = planId => (dispatch) => {
  dispatch(request(GET_PDF));
  const makeRequest = async () => {
    try {
      const { data } = await axios.get(
        GET_RUP_PDF_ENDPOINT(planId),
        { responseType: 'arraybuffer' },
      );
      dispatch(success(GET_PDF, data));
      return data;
    } catch (err) {
      dispatch(error(GET_PDF, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

const createRupSchedule = (planId, schedule) => (dispatch) => {
  dispatch(request(CREATE_RUP_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.post(
        CREATE_RUP_SCHEDULE_ENDPOINT(planId),
        { ...schedule, plan_id: planId },
      );
      dispatch(success(CREATE_RUP_SCHEDULE, data));
      return data;
    } catch (err) {
      dispatch(error(CREATE_RUP_SCHEDULE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

const updateRupSchedule = (planId, schedule) => (dispatch) => {
  dispatch(request(UPDATE_RUP_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.put(
        UPDATE_RUP_SCHEDULE_ENDPOINT(planId, schedule.id),
        { ...schedule },
      );
      dispatch(success(UPDATE_RUP_SCHEDULE, data));
      return data;
    } catch (err) {
      dispatch(error(UPDATE_RUP_SCHEDULE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const createOrUpdateRupSchedule = (planId, schedule) => (dispatch) => {
  if (schedule.id) {
    return dispatch(updateRupSchedule(planId, schedule));
  }
  return dispatch(createRupSchedule(planId, schedule));
};

export const deleteRupSchedule = (planId, scheduleId) => (dispatch) => {
  dispatch(request(DELETE_SCHEUDLE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(DELETE_RUP_SCHEDULE_ENDPOINT(planId, scheduleId));
      dispatch(success(DELETE_SCHEUDLE, data));
      return data;
    } catch (err) {
      dispatch(error(DELETE_SCHEUDLE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const deleteRupScheduleEntry = (planId, scheduleId, entryId) => (dispatch) => {
  dispatch(request(DELETE_SCHEUDLE_ENTRY));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(DELETE_RUP_SCHEDULE_ENTRY_ENDPOINT(planId, scheduleId, entryId));
      dispatch(success(DELETE_SCHEUDLE_ENTRY, data));
      return data;
    } catch (err) {
      dispatch(error(DELETE_SCHEUDLE_ENTRY, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};
