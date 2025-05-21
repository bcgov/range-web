import React from 'react';
import PermissionsField from '../../../common/PermissionsField';
import { SCHEDULE } from '../../../../constants/fields';
import Select from '../../../common/Select';
import { connect } from 'formik';
import MultiParagraphDisplay from '../../../common/MultiParagraphDisplay';

const AreasDropdown = ({ name, formik, areaId, onChange }) => {
  const areaOptions = formik.values.pastures.map((area) => {
    const { id, name } = area || {};
    return {
      key: id,
      value: id,
      label: name,
    };
  });

  return (
    <PermissionsField
      permission={SCHEDULE.PASTURE}
      name={name}
      component={Select}
      displayComponent={MultiParagraphDisplay}
      displayValue={areaOptions.find((a) => a.value === areaId)?.label}
      aria-label="area"
      options={areaOptions}
      onChange={(value) => {
        if (onChange) {
          onChange({
            value,
            area: formik.values.pastures.find((a) => a.id === value),
          });
        }
      }}
    />
  );
};

export default connect(AreasDropdown);
