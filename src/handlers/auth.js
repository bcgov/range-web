import axios from '../handlers/axios';

/*
  This is a helper class for authentication related methods
*/

class Auth {
  constructor() {
    if(!Auth.instance) {
      this._auth = {
        
      };
      this._name = 'auth-range-web';
      Auth.instance = this;
    }
    return Auth.instance;
  }
  
  /**
   * 
   * @param {function} logout
   * this method is called in App.jsx to register an interceptor to catch 
   * any 401 unauthorized response and redirect users to the login page
   */
  registerAxiosInterceptor(logout) {
    axios.interceptors.response.use(
      (response) => {
        return response;
      }, (error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error.response);
      }
    );
  }

  /**
   * this method is called immediately at the very beginning in the auth reducer
   * to initialize 'user' object in App.jsx. It checks whether
   * the user signs in previously by looking at localStorage and 
   * it returns either null or an object retrieved from localStorage 
   */
  getUserDataFromLocalStorage() {
    let user = null;
    
    const localData = JSON.parse(localStorage.getItem(this._name));
    if(localData) {
      axios.defaults.headers.common['Authorization'] = "Bearer " + localData.access_token;
      user = {...localData.user_data};
    } 
  
    return user;
  }
  
  /**
   * 
   * @param {object} response 
   * set auth header in Axios and store auth data in localstorage
   * after succesfully signing in
   */
  onSignedIn(response) {
    localStorage.setItem(this._name, JSON.stringify(response.data));
    axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.access_token;
  }
  

  /**
   * delete auth header in axios and clear localStorage after signing out
   */
  onSignedOut() {
    delete axios.defaults.headers.common['Authorization']
    localStorage.clear();
  }

  /**
   * 
   * @param {object} newUserData 
   * update the new user data in localStorage 
   * after succesfully update user profile 
   */
  onUserProfileChanged(newUserData) {
    const localData = JSON.parse(localStorage.getItem(this._name));
    if(localData) {
      localData.user_data = { ...newUserData };
      localStorage.setItem(this._name, JSON.stringify(localData));
    }
  }
}

const instance = new Auth();
Object.freeze(instance);

export default instance;