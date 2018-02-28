// // import axios from 'axios';
// import axios from '../handlers/axios';
// import querystring from 'querystring';
// import jwtDecode from 'jwt-decode';

// import {
//   SSO_BASE_URL, 
//   REFRESH_TOKEN,
//   SSO_REDIRECT_URI,
//   SSO_CLIENT_ID,
//   GET_TOKEN,
// } from '../constants/api';

// /*
//   This is a helper class for authentication related methods
// */

// export class Auth {
//   constructor() {
//     if(!Auth.instance) {
//       this._auth = {
        
//       };
//       this._name = 'auth-range-web';
//       Auth.instance = this;
//     }
//     return Auth.instance;
//   }

//   getToken(code) {
//     const data = {
//       code,
//       grant_type: 'authorization_code',
//       redirect_uri: SSO_REDIRECT_URI,
//       client_id: SSO_CLIENT_ID,
//     };
//     // make an application/x-www-form-urlencoded request with axios
//     return axios.post(SSO_BASE_URL + GET_TOKEN, querystring.stringify(data));
//   }

//   refreshAccessToken(refresh_token) {
//     const data = {
//       refresh_token,
//       grant_type: 'refresh_token',
//       redirect_uri: SSO_REDIRECT_URI,
//       client_id: SSO_CLIENT_ID,
//     };
  
//     // make an application/x-www-form-urlencoded request with axios
//     return axios.post(SSO_BASE_URL + REFRESH_TOKEN, querystring.stringify(data));
//   }
  
//   getDataFromLocal() {
//     return JSON.parse(localStorage.getItem(this._name));
//   }

//   getRefreshTokenFromLocal() {
//     const localData = this.getDataFromLocal();
//     return localData.refresh_token;
//   }

//   /**
//    * 
//    * @param {function} logout
//    * register an interceptor to catch 401 unauthorized response 
//    * case 1: access token is expired
//    *  - get new access token using the refresh token and try it again
//    * case 2: both tokens are expired
//    *  - sign out the user
//    */
//   registerResponseInterceptor(logout) {
//     axios.interceptors.request.use(config => {
//       const token = this.getRefreshTokenFromLocal();
//       return this.refreshAccessToken(token)
//       .then( response => {
//         this.onAuthenticated(response);
//         config.headers.Authorization = `${response.token_type} ${response.access_token}`;
//         return Promise.resolve(config)
//       }).catch( err => {
//         return Promise.reject(err)
//       });
//     });

//     axios.interceptors.response.use(
//       (response) => {
//         return response;
//       }, (error) => {
//         const originalRequest = error.config;
        
//         if (error.response && error.response.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;
//           const token = this.getRefreshToken();

//           return this.refreshAccessToken(token)
//             .then(response => {
//               // successfully get a new access token
//               this.onAuthenticated(response);
//               originalRequest.headers['Authorization'] = `${response.token_type} ${response.access_token}`;
//               return axios(originalRequest);
//             })
//             .catch(err => {
//               // refresh token is also expired
//               logout();
//               return Promise.reject(error.response)
//             });
//         }
//         return Promise.reject(error.response);
//       }
//     );
//   }
  
//   /**
//    * this method is called immediately at the very beginning in the auth reducer
//    * to initialize 'user' object in App.jsx. It checks whether
//    * the user signs in previously by looking at localStorage and 
//    * it returns either null or an object retrieved from localStorage 
//    */
//   getUserData() {
//     let user = null;
    
//     const localData = this.getDataFromLocal();
//     if(localData) {
//       axios.defaults.headers.common['Authorization'] = `${localData.token_type} ${localData.access_token}`;
//       user = {...localData.user_data};
//     } 
  
//     return user;
//   }
//   /**
//    * 
//    * @param {object} response 
//    * set auth header in Axios and store auth data in localstorage
//    * after succesfully authenticate
//    */
//   onAuthenticated(response) {
//     if(response && response.data) {
//       const data = response.data;
//       data.user_data = jwtDecode(response.data.access_token);

//       localStorage.setItem(this._name, JSON.stringify(data));
//       axios.defaults.headers.common['Authorization'] = `${data.token_type} ${data.access_token}`;
//     }
//   }

//   /**
//    * delete auth header in axios and clear localStorage after signing out
//    */
//   onSignedOut() {
//     delete axios.defaults.headers.common['Authorization']
//     localStorage.clear();
//   }

//   /**
//    * 
//    * @param {object} newUserData 
//    * update the new user data in localStorage 
//    * after succesfully update user profile 
//    */
//   onUserProfileChanged(newUserData) {
//     const localData = this.getDataFromLocal();
//     if(localData) {
//       localData.user_data = { ...newUserData };
//       localStorage.setItem(this._name, JSON.stringify(localData));
//     }
//   }
// }

// const instance = new Auth();
// Object.freeze(instance);

// export default instance;