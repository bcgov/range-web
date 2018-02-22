// import axios from 'axios';
// import { toastErrorMessage } from './toastActions.jsx';

import { AUTH } from '../constants/reducerTypes';
// import API from '../constants/API.jsx';
import {
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  USER_PROFILE_CHANGE
} from '../constants/actionTypes';

import Auth from '../handlers/auth';
// import Handlers from '../handlers';

const fakeResponse = 
{ 
  data : {
  "status": 1,
  "message": "success",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImM0ZDNmZmU1MGJiNTYwMjNjNDQ1OTViMzM2Y2EzYThmMzkwZjE5ZmUyMTNhM2ZiODdlM2VlODVjNDZmYzliYTEwZjRjNTI0YzZhOTRiYmY2In0.eyJhdWQiOiIxIiwianRpIjoiYzRkM2ZmZTUwYmI1NjAyM2M0NDU5NWIzMzZjYTNhOGYzOTBmMTlmZTIxM2EzZmI4N2UzZWU4NWM0NmZjOWJhMTBmNGM1MjRjNmE5NGJiZjYiLCJpYXQiOjE1MTE3MjUwOTgsIm5iZiI6MTUxMTcyNTA5OCwiZXhwIjoxNTQzMjYxMDk3LCJzdWIiOiIzIiwic2NvcGVzIjpbXX0.idAb1qXC_BW7_E5LOSxMCqqkmZzJff6iv9Uspq8huLFXp22tVT0bI17KMA8ls4FZYjcofvR8Z-aq7GfL_ZAmq0uGYPq-PvpKJ0BbrAE6CBk6ojAKbXz5SNn_E-nLAbMKwA84efMLDoKwirZEKRyw_FwWBHx8z7YIlwogw5TBdG5W2wexgpLo3ZBVP6cjEdvgVdA-eiKIuCD4Q-Wti3UYMwE9pkCDLeg2lvVvGBCMW6BdwGqIOOPELyEItB5qmnarCzGqfWTmXEvqHjJFV9WZsUn9ZfdjMcfT52LTF0eNhM4AKndh-PiIhhJcRvwBGEoZaq5M4tAbOlc3ImTX4tuotsM74FNlaDzu0otQYemBuh9zJHEPgHne4KNE0HggPvrspkiciFukl7VcZ9q19JzroEIl2FGWMecV0xqDOZmVI7EchYXgjRkfnc4q6imauvvSAdN_hKOeAHRURFD1ukZfAJNotk8LMvtJFl3tTHhNGOWIZRBosaQyuLk59w7D87ft_Uif5OTIxJ2P-V7Slfz3l9L4gsoae67CF4AzARjRva3Vz7baxpLvZJW0-6boWvycxpityO7D_RPk25sUP7OfwygKiQwgy9xFMhIIGgROb9notIztBSFhZ-QjJQAXzXBeGioBGOKJ5Aq8IJHtQRuO9-m3CJIN4-XK__4pLmRtDjs",
  "user_data": {
      "id": 3,
      "name": "Kyubin Han",
      "email": "brand@mailinator.com",
      "contact": null,
      "activated": 1,
      "status": 1,
      "notify": 1,
      "picture_uri": null
    }
  }
};

export const loginSuccess = (data, user) => {
  return {
    name: AUTH,
    type: LOGIN_SUCCESS,
    data,
    user
  }
}

export const loginRequest = () => {
  return {
    name: AUTH,
    type: LOGIN_REQUEST,
  }
}

export const loginError = (errorMessage) => {
  return {
    name: AUTH,
    type: LOGIN_ERROR,
    errorMessage
  }
}

export const logoutSuccess = () => {
  return {
    name: AUTH,
    type: LOGOUT_SUCCESS
  }
}

export const userProfileChange = (user) => {
  return {
    name: AUTH,
    type: USER_PROFILE_CHANGE,
    user
  }
}

export const login = (requestData) => (dispatch) => {
  dispatch(loginRequest());

  setTimeout(() => {
    Auth.onSignedIn(fakeResponse);
    dispatch(loginSuccess(fakeResponse.data, fakeResponse.data.user_data));
  }, 1000);

  // const { email, password } = requestData;
  // axios.post(API.BASE_URL + API.LOGIN, {
  //   email,
  //   password
  // }).then(response => {
  //   const successful = Handlers.handleResponse(response);
  //   if (successful) {
  //     Auth.onSignedIn(response);
  //     dispatch(loginSuccess(response.data, response.data.user_data));
  //   } else {
  //     dispatch(loginError(response));
      
  //     const err = { response };
  //     dispatch(toastErrorMessage(err));
  //   }
    
  // }).catch(err => {
  //   dispatch(loginError(err));
  //   dispatch(toastErrorMessage(err));
  // });
}

export const logout = () => (dispatch) => {
  Auth.onSignedOut();
  dispatch(logoutSuccess());
}
