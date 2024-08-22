import { normalize } from 'normalizr';
import * as schema from './schema';
import * as actions from '../actions';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/api';
import { getAuthTimeout, getUser } from '../reducers/rootReducer';
import { axios, saveUserProfileInLocal, createConfigWithHeader, setTimeoutForReAuth } from '../utils';
import { toastSuccessMessage, toastErrorMessage } from './toastActionCreator';
import { ASSIGN_STAFF_TO_ZONE_SUCCESS, UPDATE_USER_PROFILE_SUCCESS } from '../constants/strings';

export * from './planActionCreator';
export * from './toastActionCreator';
export * from './commonActionCreator';
export * from './grazingScheduleActionCreator';
export * from './pastureActionCreator';
export * from './ministerIssueActionCreator';
export * from './requirementAndConsiderationActionCreator';

export const fetchAgreement = (agreementId) => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.GET_AGREEMENT));
  return axios.get(API.GET_AGREEMENT(agreementId), createConfigWithHeader(getState)).then(
    (response) => {
      const agreement = response.data;
      dispatch(actions.success(reducerTypes.GET_AGREEMENT, agreement));
      dispatch(actions.storeAgreementWithAllPlans(normalize(agreement, schema.agreement)));

      return agreement;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.GET_AGREEMENT, err));
      throw err;
    },
  );
};

export const searchClients = (term) => (dispatch, getState) => {
  if (!term) {
    return dispatch(actions.storeClients(normalize([], schema.arrayOfClients)));
  }

  dispatch(actions.request(reducerTypes.SEARCH_CLIENTS));

  const config = {
    ...createConfigWithHeader(getState),
    params: {
      term,
    },
  };
  return axios.get(API.SEARCH_CLIENTS, config).then(
    (response) => {
      const clients = response.data;
      dispatch(actions.success(reducerTypes.SEARCH_CLIENTS));
      dispatch(actions.storeClients(normalize(clients, schema.arrayOfClients)));
      return clients;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.SEARCH_CLIENTS, err));
      throw err;
    },
  );
};

export const updateUserIdOfZone = (zoneId, userId) => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.UPDATE_USER_ID_OF_ZONE));
  return axios.put(API.UPDATE_USER_ID_OF_ZONE(zoneId), { userId }, createConfigWithHeader(getState)).then(
    (response) => {
      dispatch(actions.success(reducerTypes.UPDATE_USER_ID_OF_ZONE));
      dispatch(toastSuccessMessage(ASSIGN_STAFF_TO_ZONE_SUCCESS));
      return response.data;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.UPDATE_USER_ID_OF_ZONE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    },
  );
};

export const resetTimeoutForReAuth = (reauthenticate) => (dispatch, getState) => {
  clearTimeout(getAuthTimeout(getState()));

  const timeoutId = setTimeoutForReAuth(reauthenticate);
  dispatch(actions.setTimeoutForAuthentication(timeoutId));
};

export const signOut = () => (dispatch) => {
  // clear the local storage in the browser
  localStorage.clear();
  dispatch(actions.removeAuthDataAndUser());
};

export const fetchUser = () => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.GET_USER));
  return axios.get(API.GET_USER_PROFILE, createConfigWithHeader(getState)).then(
    (response) => {
      const user = response.data;
      dispatch(actions.success(reducerTypes.GET_USER, user));
      dispatch(actions.storeUser(user));
      saveUserProfileInLocal(user);
      return user;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.GET_USER, err));
      dispatch(toastErrorMessage(err));
      throw err;
    },
  );
};

export const updateUser = (data) => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.UPDATE_USER));

  return axios.put(API.UPDATE_USER_PROFILE, data, createConfigWithHeader(getState)).then(
    (response) => {
      const currUser = getUser(getState());
      const updatedUser = {
        ...currUser,
        ...response.data,
      };
      dispatch(actions.success(reducerTypes.UPDATE_USER, updatedUser));
      dispatch(actions.storeUser(updatedUser));
      dispatch(toastSuccessMessage(UPDATE_USER_PROFILE_SUCCESS));
      saveUserProfileInLocal(updatedUser);

      return updatedUser;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.UPDATE_USER, err));
      throw err;
    },
  );
};

// export const searchAgreements = (params) => (dispatch, getState) => {
//   const { page = 1, limit = DEFAULT_SEARCH_LIMIT } = params;
//
//   if (getIsFetchingAgreements(getState())) {
//     return Promise.resolve();
//   }
//   dispatch(actions.request(reducerTypes.SEARCH_AGREEMENTS));
//
//   const config = {
//     ...createConfigWithHeader(getState),
//     params: {
//       page: Number(page),
//       limit: Number(limit),
//     },
//   };
//
//   return axios.get(API.SEARCH_AGREEMENTS, config).then(
//     (response) => {
//       dispatch(
//         actions.successPagenated(reducerTypes.SEARCH_AGREEMENTS, response.data),
//       );
//       const payload = {
//         ...normalize(response.data.agreements, schema.arrayOfAgreements),
//         params,
//       };
//
//       dispatch(actions.storeAgreements(payload));
//       return response.data;
//     },
//     (err) => {
//       dispatch(actions.error(reducerTypes.SEARCH_AGREEMENTS, err));
//       throw err;
//     },
//   );
// };
