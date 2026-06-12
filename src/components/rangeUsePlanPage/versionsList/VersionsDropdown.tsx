import React, { useState } from 'react';
import useSWR from 'swr';
import * as API from '../../../constants/api';
import { axios, getAuthHeaderConfig } from '../../../utils';
import VersionsDropdownList from './VersionsDropdownList';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

interface VersionsDropdownProps {
  planId: any;
  open: boolean;
}

const VersionsDropdown = ({ planId, open }: VersionsDropdownProps) => {
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const endpoint = API.GET_RUP_VERSIONS(planId);

  const { data, error, isValidating } = useSWR(
    () => (open ? endpoint : null),
    (key: string) =>
      axios
        .get(key, {
          ...getAuthHeaderConfig(),
        })
        .then((res: any) => res.data),
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
      onSelectVersion={(e: any, { value }: any) => setSelectedVersion(value)}
    />
  );
};

export default VersionsDropdown;
