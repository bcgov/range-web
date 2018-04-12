import {
  success,
  request,
  error,
} from '../actions/genericActions';

import {
  saveReferencesInLocal,
} from '../handlers';

import { GET_REFERENCES } from '../constants/reducerTypes';
import { BASE_URL, REFERENCES } from '../constants/api';
import axios from '../handlers/axios';

export const getReferences = () => (dispatch) => {
  dispatch(request(GET_REFERENCES));

  const makeRequest = async () => {
    try {
      const response = await axios.get(BASE_URL + REFERENCES);
      const references = response.data;
      
      saveReferencesInLocal(references);
      dispatch(success(GET_REFERENCES, references));
    } catch (err) {
      dispatch(error(GET_REFERENCES, err));
    }
  }
  return makeRequest();
};