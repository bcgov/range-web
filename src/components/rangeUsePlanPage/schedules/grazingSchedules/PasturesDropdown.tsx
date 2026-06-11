import React from 'react';
import PermissionsField from '../../../common/PermissionsField';
import { SCHEDULE } from '../../../../constants/fields';
import Select from '../../../common/Select';
import { useFormikContext } from 'formik';
import MultiParagraphDisplay from '../../../common/MultiParagraphDisplay';

interface PasturesDropdownProps {
  name: string;
  pastureId: any;
  onChange?: (data: { value: any; pasture: any }) => void;
}

const PasturesDropdown = ({ name, pastureId, onChange }: PasturesDropdownProps) => {
  const formik = useFormikContext<any>();
  const pastureOptions = formik.values.pastures.map((pasture: any) => {
    const { id, name: pastureName } = pasture || {};
    return {
      key: id,
      value: id,
      label: pastureName,
    };
  });

  return (
    <PermissionsField
      permission={SCHEDULE.PASTURE}
      name={name}
      component={Select}
      displayComponent={MultiParagraphDisplay}
      displayValue={pastureOptions.find((p: any) => p.value === pastureId)?.label}
      aria-label="pasture"
      options={pastureOptions}
      onChange={(value: any) => {
        if (onChange) {
          onChange({
            value,
            pasture: formik.values.pastures.find((p: any) => p.id === value),
          });
        }
      }}
    />
  );
};

export default PasturesDropdown;
