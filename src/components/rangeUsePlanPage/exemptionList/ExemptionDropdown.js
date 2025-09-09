import React, { useState } from 'react';
import useSWR from 'swr';
import * as API from '../../../constants/api';
import { axios, getAuthHeaderConfig } from '../../../utils';
import ExemptionDropdownList from './ExemptionDropdownList';

const ExemptionDropdown = ({ agreementId, open }) => {
  const [selectedExemption, setSelectedExemption] = useState(null);
  const endpoint = API.GET_AGREEMENT_EXEMPTIONS(agreementId);

  const { data, error, isValidating } = useSWR(
    () => (open ? endpoint : null),
    (key) =>
      axios
        .get(key, {
          ...getAuthHeaderConfig(),
        })
        .then((res) => res.data),
  );

  const { exemptions = [] } = data || {};

  if (error) return <div>Error: {JSON.stringify(error.message)}</div>;
  if (isValidating) {
    return <p>Loading exemption data...</p>;
  }

  if (!exemptions || exemptions.length === 0) {
    return null;
  }
  return (
    <ExemptionDropdownList
      exemptions={exemptions}
      selectedExemption={selectedExemption}
      open={open}
      onSelectExemption={(e, { value }) => setSelectedExemption(value)}
    />
  );
};

export default ExemptionDropdown;
