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
  dataChanged,
} from '../actions/genericActions';
import { ASSIGN_STAFF_TO_ZONE_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import { ASSIGN_STAFF_TO_ZONE, GET_ZONES } from '../constants/reducerTypes';
import { UPDATE_STAFF_OF_ZONE_ENDPOINT } from '../constants/api';
import axios from '../handlers/axios';

export const assignStaffToZone = (zoneId, userId) => (dispatch) => {
  dispatch(request(ASSIGN_STAFF_TO_ZONE));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        UPDATE_STAFF_OF_ZONE_ENDPOINT(zoneId),
        { userId },
      );
      dispatch(success(ASSIGN_STAFF_TO_ZONE, response.data));
      dispatch(toastSuccessMessage(ASSIGN_STAFF_TO_ZONE_SUCCESS));
      return response.data;
    } catch (err) {
      dispatch(error(ASSIGN_STAFF_TO_ZONE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };

  return makeRequest();
};

// update zones in Redux state
export const staffAssignedToZone = (zones, zoneId, assignedUser) => (dispatch) => {
  const newZones = zones.map((z) => {
    const zone = { ...z };
    if (zone.id === zoneId) {
      zone.userId = assignedUser.id;
      zone.user = assignedUser;
    }
    return zone;
  });
  dispatch(dataChanged(GET_ZONES, newZones));
};
