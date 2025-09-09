import React, { useState } from 'react';
import useSWR from 'swr';
import * as API from '../../../constants/api';
import { axios, getAuthHeaderConfig } from '../../../utils';
import VersionsDropdownList from './VersionsDropdownList';
import { TableCell, TableRow } from 'semantic-ui-react';

const VersionsDropdown = ({ planId, open }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const endpoint = API.GET_RUP_VERSIONS(planId);

  const { data, error, isValidating } = useSWR(
    () => (open ? endpoint : null),
    (key) =>
      axios
        .get(key, {
          ...getAuthHeaderConfig(),
        })
        .then((res) => res.data),
  );

  const { versions = [] } = data || {};

  if (error) return <div>Error: {JSON.stringify(error.message)}</div>;
  if (isValidating) {
    return (
      <TableRow>
        <TableCell colSpan={13} style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
          <p>Loading version data...</p>
        </TableCell>
      </TableRow>
    );
  }
  return (
    <VersionsDropdownList
      planId={planId}
      versions={versions}
      selectedVersion={selectedVersion}
      open={open}
      onSelectVersion={(e, { value }) => setSelectedVersion(value)}
    />
  );
};

export default VersionsDropdown;
