import React from 'react';
import PermissionsField from '../../../common/PermissionsField';
import { SCHEDULE } from '../../../../constants/fields';
import Select from '../../../common/Select';
import { useFormikContext } from 'formik';
import MultiParagraphDisplay from '../../../common/MultiParagraphDisplay';

interface AreasDropdownProps {
  name: string;
  areaId: any;
  onChange?: (data: { value: any; area: any }) => void;
}

const AreasDropdown = ({ name, areaId, onChange }: AreasDropdownProps) => {
  const formik = useFormikContext<any>();
  const areaOptions = formik.values.pastures.map((area: any) => {
    const { id, name: areaName } = area || {};
    return {
      key: id,
      value: id,
      label: areaName,
    };
  });

  return (
    <PermissionsField
      permission={SCHEDULE.PASTURE}
      name={name}
      component={Select}
      displayComponent={MultiParagraphDisplay}
      displayValue={areaOptions.find((a: any) => a.value === areaId)?.label}
      aria-label="area"
      options={areaOptions}
      onChange={(value: any) => {
        if (onChange) {
          onChange({
            value,
            area: formik.values.pastures.find((a: any) => a.id === value),
          });
        }
      }}
    />
  );
};

export default AreasDropdown;
