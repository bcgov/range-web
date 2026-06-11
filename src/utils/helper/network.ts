import { getAuthHeaderConfig } from '../authentication';
import { API_BASE_URL } from '../../constants/api';

export const getNetworkStatus = async (): Promise<boolean> => {
  try {
    await fetch(`${API_BASE_URL}/v1/version`, getAuthHeaderConfig() as RequestInit);
    return true;
  } catch (e) {
    return false;
  }
};
