import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
});

// instance.interceptors.response.use(response => (
//   response
// ), error => (
//   Promise.reject(error && error.response)
// ));

export default instance;
