import { AUTH } from '../constants/reducerTypes';
import {
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  USER_PROFILE_CHANGE
} from '../constants/actionTypes';
import * as actions from './authActions';

it('creates an action to login successfully', () => {
  const user = { name: "kyub" };
  const data = { user_data: user };
  const expectedAction = {
    name: AUTH,
    type: LOGIN_SUCCESS,
    data,
    user: data.user_data
  };

  expect(actions.loginSuccess(data, user)).toEqual(expectedAction);
});