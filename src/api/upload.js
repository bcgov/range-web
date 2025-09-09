import * as API from '../constants/api';
import { getAuthHeaderConfig, axios } from '../utils';

export const getSignedUploadUrl = async (fileName) => {
  const res = await axios.get(API.GET_SIGNED_URL(fileName), getAuthHeaderConfig());
  return res.data.url;
};

export const getSignedDownloadUrl = async (fileId, fileType = 'plan') => {
  const response = await axios.get(API.GET_SIGNED_DOWNLOAD_URL(fileId, fileType), getAuthHeaderConfig());

  return response.data;
};

export const deleteFile = async (fileId) => {
  const response = await axios.delete(API.DELETE_FILE(fileId), getAuthHeaderConfig());
  return response.data;
};
