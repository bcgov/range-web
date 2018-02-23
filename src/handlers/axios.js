import baseAxios from 'axios';

/*
  This is a helper class for axios related methods
*/

export const axios = baseAxios.create({
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

export default axios;
