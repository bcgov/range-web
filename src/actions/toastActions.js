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

import { TOAST } from '../constants/reducerTypes';
import {
  OPEN_TOAST_MESSAGE,
  CLOSE_TOAST_MESSAGE,
} from '../constants/actionTypes';
import { getErrorMessage } from '../handlers';

export const openToastMessage = (success, message) => (
  {
    name: TOAST,
    type: OPEN_TOAST_MESSAGE,
    success,
    error: !success,
    message,
  }
);

export const closeToastMessage = () => (
  {
    name: TOAST,
    type: CLOSE_TOAST_MESSAGE,
  }
);

let toastTimeout = null;
const toastMessage = (success, message, timeout = 5000) => (dispatch) => {
  // unregister the timeout to prevent from closing
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // close the previous message if it was presented
  dispatch(closeToastMessage());

  // open a new message
  dispatch(openToastMessage(success, message));

  toastTimeout = setTimeout(() => {
    dispatch(closeToastMessage());
  }, timeout);
};

export const toastErrorMessage = (err, timeout) => (dispatch) => {
  const errorMessage = getErrorMessage(err);
  dispatch(toastMessage(false, errorMessage, timeout));
};

export const toastSuccessMessage = (message = 'Success!', timeout) => (dispatch) => {
  dispatch(toastMessage(true, message, timeout));
};
