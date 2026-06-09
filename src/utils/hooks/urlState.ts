// @ts-nocheck
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useUrlState = (key, initialState) => {
  if (!key) {
    throw new Error('`key` must be provided to useUrlState');
  }

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  let paramValue = params.get(key);
  if (!isNaN(paramValue)) {
    paramValue = parseFloat(paramValue);
  }

  const [value, setValue] = useState(paramValue || initialState);

  const setValueAndParam = (value) => {
    const params = new URLSearchParams(location.search);

    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    navigate({ ...location, search: params.toString() }, { replace: true });
    setValue(value);
  };

  return [value, setValueAndParam];
};
