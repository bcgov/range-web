import { axios, getAuthHeaderConfig } from '../utils';
import { GET_SIGNED_URL } from '../constants/api';

export const getSignedUploadUrl = async (fileName) => {
  const res = await axios.get(GET_SIGNED_URL(fileName), getAuthHeaderConfig());
  return res.data.url;
};
