import { normalize } from 'normalizr';
import * as schema from './schema';
import * as actions from '../actions';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/api';
import { getAuthTimeout, getUser } from '../reducers/rootReducer';
import {
  axios,
  saveUserProfileInLocal,
  createConfigWithHeader,
  setTimeoutForReAuth,
  getDataFromLocalStorage,
  refreshAccessToken,
  saveAuthDataInLocal,
} from '../utils';
import { toastSuccessMessage, toastErrorMessage } from './toastActionCreator';
import { UPDATE_USER_PROFILE_SUCCESS } from '../constants/strings';
import { LOCAL_STORAGE_KEY, SESSION_EXPIRY_WARNING_TOAST_ID } from '../constants/variables';
import { storeAuthData, reauthenticate } from '../actions';
import type { AppThunk } from '../configureStore';

export * from './planActionCreator';
export * from './toastActionCreator';
export * from './commonActionCreator';
export * from './grazingScheduleActionCreator';
export * from './pastureActionCreator';
export * from './ministerIssueActionCreator';
export * from './requirementAndConsiderationActionCreator';

export const fetchAgreement =
  (agreementId: string): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    dispatch(actions.request(reducerTypes.GET_AGREEMENT));
    return axios.get(API.GET_AGREEMENT(agreementId), createConfigWithHeader(getState)).then(
      (response: any) => {
        const agreement = response.data;
        dispatch(actions.success(reducerTypes.GET_AGREEMENT, agreement));
        dispatch(actions.storeAgreementWithAllPlans(normalize(agreement, schema.agreement)));

        return agreement;
      },
      (err: any) => {
        dispatch(actions.error(reducerTypes.GET_AGREEMENT, err));
        throw err;
      },
    );
  };

export const extendSession = (): AppThunk<Promise<void>> => (dispatch) => {
  const data = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH) as any;
  const refreshToken = data && data.refresh_token;

  if (!refreshToken) {
    console.error('No refresh token found to extend session.');
    return Promise.reject(new Error('No refresh token.'));
  }

  return refreshAccessToken(refreshToken).then(
    (response: any) => {
      const authData = saveAuthDataInLocal(response);
      dispatch(storeAuthData(authData));
      dispatch(resetTimeoutForReAuth(reauthenticate));
      dispatch(actions.removeToast({ toastId: SESSION_EXPIRY_WARNING_TOAST_ID }));
      dispatch(toastSuccessMessage('Session extended successfully.'));
    },
    (err: any) => {
      console.error('Failed to extend session:', err);
      // Let the reauthenticate process handle the sign-in modal
      // Or show a specific error toast if needed.
    },
  );
};

export const resetTimeoutForReAuth =
  (reauthenticateFn: () => void): AppThunk<void> =>
  (dispatch, getState) => {
    const { authTimeoutId, warningTimeoutId } = getAuthTimeout(getState()) || {};
    clearTimeout(authTimeoutId);
    clearTimeout(warningTimeoutId);

    const timeoutIds = setTimeoutForReAuth(reauthenticateFn, dispatch);
    dispatch(actions.setTimeoutForAuthentication(timeoutIds as any));
  };

export const signOut = (): AppThunk<void> => (dispatch) => {
  // clear the local storage in the browser
  localStorage.clear();
  dispatch(actions.removeAuthDataAndUser());
};

export const fetchUser = (): AppThunk<Promise<any>> => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.GET_USER));
  return axios.get(API.GET_USER_PROFILE, createConfigWithHeader(getState)).then(
    (response: any) => {
      const user = response.data;
      dispatch(actions.success(reducerTypes.GET_USER, user));
      dispatch(actions.storeUser(user));
      saveUserProfileInLocal(user);
      return user;
    },
    (err: any) => {
      dispatch(actions.error(reducerTypes.GET_USER, err));
      dispatch(toastErrorMessage(err));
      throw err;
    },
  );
};

export const updateUser =
  (data: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    dispatch(actions.request(reducerTypes.UPDATE_USER));

    return axios.put(API.UPDATE_USER_PROFILE, data, createConfigWithHeader(getState)).then(
      (response: any) => {
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
      (err: any) => {
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
