import { AUTH } from '../constants/reducerTypes';
import { LOGIN_SUCCESS } from '../constants/actionTypes';
import * as actions from './authActions';

it('creates an action to login successfully', () => {
  const user = { name: 'kyub' };
  const data = { auth_data: user };
  const expectedAction = {
    name: AUTH,
    type: LOGIN_SUCCESS,
    data,
    user: data.auth_data,
  };

  expect(actions.loginSuccess(data, user)).toEqual(expectedAction);
});
