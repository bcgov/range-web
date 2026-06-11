import React from 'react';
import useSWR from 'swr';
import * as API from '../../../constants/api';
import { axios, getAuthHeaderConfig } from '../../../utils';
import ExemptionDropdownList from './ExemptionDropdownList';
import { TableCell, TableRow } from 'semantic-ui-react';

interface ExemptionDropdownProps {
  agreementId: string;
  open: boolean;
  onEditExemption?: (exemption: any) => void;
  onUpdate?: () => void;
}

function ExemptionDropdown({ agreementId, open, onEditExemption, onUpdate }: ExemptionDropdownProps) {
  const endpoint = API.GET_AGREEMENT_EXEMPTIONS(agreementId);

  const { data, error, isValidating, mutate } = useSWR(
    () => (open ? endpoint : null),
    (key: string) =>
      axios
        .get(key, {
          ...getAuthHeaderConfig(),
        })
        .then((res: any) => res.data),
  );

  const exemptions = data;

  const handleExemptionUpdate = () => {
    mutate();
    if (onUpdate) {
      onUpdate();
    }
  };

  if (error) return <div>Error: {JSON.stringify(error.message)}</div>;
  if (isValidating) {
    return (
      <TableRow>
        <TableCell colSpan={13} style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
          <p>Loading...</p>
        </TableCell>
      </TableRow>
    );
  }

  if (!exemptions || exemptions.length === 0) {
    return null;
  }
  return (
    <ExemptionDropdownList
      exemptions={exemptions}
      open={open}
      onExemptionUpdate={handleExemptionUpdate}
      onEditExemption={onEditExemption}
    />
  );
}

export default ExemptionDropdown;
