import { LOCAL_STORAGE_KEY } from '../constants/variables';

/**
 * Save data in local storage
 *
 * @param key - the localStorage key
 * @param data - the data to store (objects are JSON-serialized)
 */
export const saveDataInLocalStorage = (key: string, data: unknown): void => {
  const serializedData = typeof data === 'object' ? JSON.stringify(data) : String(data);
  localStorage.setItem(key, serializedData);
};

/**
 * Get data that was saved in local storage
 *
 * @param key - the localStorage key
 * @returns the parsed data object, raw string, or undefined if not found
 */
export const getDataFromLocalStorage = (key: string): unknown => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data) as unknown;
    } catch (err) {
      return data;
    }
  }
  return undefined;
};

export const saveReferencesInLocalStorage = (data: unknown): void => {
  saveDataInLocalStorage(LOCAL_STORAGE_KEY.REFERENCE, data);
};

export const getReferencesFromLocalStorage = (): unknown => getDataFromLocalStorage(LOCAL_STORAGE_KEY.REFERENCE);
