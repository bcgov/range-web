import authReducer from '../authReducer';
import { LOGIN_SUCCESS } from '../../constants/actionTypes';

describe('authReducer', () => {
  it('login successfully', () => {
    const user = { name: "kyub" };
    const data = { user };
    
    const result = authReducer(null, { type: LOGIN_SUCCESS, data, user });
    expect(result.data).toEqual(data);
    expect(result.user).toEqual(user);
  });
});