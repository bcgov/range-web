import {
  success,
  request,
  error,
} from '../actions/genericActions';

import {
  saveReferencesInLocal,
} from '../handlers';

import { REFERENCES } from '../constants/reducerTypes';
import { BASE_URL, GET_REFERENCES } from '../constants/api';
import axios from '../handlers/axios';

export const getReferences = (requestData) => (dispatch) => {
  dispatch(request(REFERENCES));

  const makeRequest = async () => {
    try {
      const response = await axios.get(BASE_URL + GET_REFERENCES);
      const references = response.data;
      
      saveReferencesInLocal(references);
      dispatch(success(REFERENCES, references));
    } catch (err) {
      dispatch(error(REFERENCES, err));
    }
  }
  makeRequest();
};