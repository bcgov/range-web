import axios from 'axios';
import { BASE_URL } from '../constants/api';

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.response.use(response => (
  response
), error => (
  Promise.reject(error.response)
));

export default instance;
