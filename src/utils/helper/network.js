import { getAuthHeaderConfig } from '../authentication';
import { API_BASE_URL } from '../../constants/api';

export const getNetworkStatus = async () => {
  try {
    await fetch(`${API_BASE_URL}/v1/version`, getAuthHeaderConfig());
    return true;
  } catch (e) {
    return false;
  }
};
