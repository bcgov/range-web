import axios from 'axios';

/*
  create a custom axios instance
*/

export const instance = axios.create({
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

export default instance;
