import {
  LOGOUT_SUCCESS,
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  USER_PROFILE_CHANGE
} from '../constants/actionTypes';

import Auth from '../handlers/auth';

const authReducer = (state = {
  isLoading: false,
  user: Auth.getUserDataFromLocalStorage(),
  success: false,
}, action) => {
  switch (action.type) {
    case LOGIN_REQUEST: 
      return {
        ...state,
        success: false,
        isLoading: true,
      }
    case LOGIN_SUCCESS: 
      return {
        ...state, 
        isLoading: false,
        success: true,
        data: action.data,
        user: action.user,
      }
    case LOGIN_ERROR: 
      return {
        ...state, 
        isLoading: false,
        success: false,
        errorMessage: action.errorMessage
      }     
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null
      }
    case USER_PROFILE_CHANGE: 
      return {
        ...state, 
        user: action.user,        
      }  
    default: 
      return state    
  }
};

export default authReducer;