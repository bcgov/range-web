/**
 * Save data in local storage
 *
 * @param {string} key
 * @param {object} data
 * @returns undefined
 */
export const saveDataInLocal = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (err) {
    throw err;
  }
};

/**
 * Get data that was saved in local storage
 *
 * @param {string} key
 * @returns {object} the data object
 */
export const getDataFromLocal = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData) {
      return JSON.parse(serializedData);
    }
    return undefined;
  } catch (err) {
    return undefined;
  }
};
