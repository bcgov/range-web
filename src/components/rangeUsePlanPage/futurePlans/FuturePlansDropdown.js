import React from 'react';
import useSWR from 'swr';
import * as API from '../../../constants/api';
import { axios, getAuthHeaderConfig } from '../../../utils';
import FuturePlansDropdownList from './FuturePlansDropdownList';

const FuturePlansDropdown = ({ planId, open }) => {
  const endpoint = API.GET_EXTENSION_PLAN(planId);

  const { data, error, isValidating } = useSWR(
    () => (open ? endpoint : null),
    (key) =>
      axios
        .get(key, {
          ...getAuthHeaderConfig(),
        })
        .then((res) => res.data),
  );
  const futurePlans = data || [];
  if (error) return <div>Error: {JSON.stringify(error.message)}</div>;
  if (isValidating) {
    return <p>Loading futurePlan data...</p>;
  }
  return <FuturePlansDropdownList futurePlans={futurePlans} open={open} />;
};

export default FuturePlansDropdown;
