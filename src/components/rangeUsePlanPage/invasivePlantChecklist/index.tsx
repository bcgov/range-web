import React, { memo, useState } from 'react';
import { connect, useField } from 'formik';
import { InfoTip } from '../../common';
import PermissionsField, { canUserEdit } from '../../common/PermissionsField';
import * as strings from '../../../constants/strings';
import { INVASIVE_PLANTS } from '../../../constants/fields';
import TextFieldMui from '@mui/material/TextField';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { useUser } from '../../../providers/UserProvider';
import { useEditable } from '../../../providers/EditableProvider';
import MultiParagraphDisplay from '../../common/MultiParagraphDisplay';

function FieldCheckbox(props: any) {
  const { name, label, displayValue, inputProps } = props;
  const [field] = useField(name);
  const showReadOnly = !!displayValue && !field.value;
  const checked = showReadOnly ? !!displayValue : !!field.value;
  return <FormControlLabel control={<MuiCheckbox checked={checked} {...field} {...inputProps} />} label={label} />;
}

function TextAreaField(props: any) {
  const { name, inputProps, label, displayValue } = props;
  const [field, meta] = useField(name);
  const showReadOnly = !!displayValue && !meta.value;
  if (showReadOnly) {
    return <TextFieldMui label={label} value={displayValue} fullWidth disabled multiline minRows={3} />;
  }
  return (
    <TextFieldMui
      {...field}
      {...inputProps}
      label={label}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
      fullWidth
      multiline
      minRows={3}
    />
  );
}

interface InvasivePlantChecklistProps {
  namespace: string;
  invasivePlantChecklist: {
    equipmentAndVehiclesParking: boolean;
    beginInUninfestedArea: boolean;
    undercarrigesInspected: boolean;
    revegetate: boolean;
    other?: string;
  };
  formik: any;
}

function InvasivePlantChecklist({ namespace, invasivePlantChecklist, formik }: InvasivePlantChecklistProps) {
  const { equipmentAndVehiclesParking, beginInUninfestedArea, undercarrigesInspected, revegetate, other } =
    invasivePlantChecklist;

  const [otherChecked, setOtherChecked] = useState(!!other);
  const globalIsEditable = useEditable();

  const user = useUser();
  const canEdit = canUserEdit(INVASIVE_PLANTS.ITEMS, user as any) && globalIsEditable;

  return (
    <div className="rup__ip-checklist">
      <div className="rup__popup-header">
        <div className="rup__content-title">{strings.INVASIVE_PLANTS}</div>
        <InfoTip header={strings.INVASIVE_PLANTS} content={strings.INVASIVE_PLANTS_TIP} />
      </div>
      <div className="rup__divider" />
      <div className="rup__ip-checklist__header">
        I commit to carry out the following measures to prevent the introduction or spread of invasive plants that are
        likely the result of my range practices:
      </div>
      <div className="rup__ip-checklist__form">
        <FormGroup>
          <PermissionsField
            name={`${namespace}.equipmentAndVehiclesParking`}
            permission={INVASIVE_PLANTS.ITEMS}
            component={FieldCheckbox}
            label="Equipment and vehicles will not be parked on invasive plant infestations"
            displayValue={equipmentAndVehiclesParking}
            fast
            inline
            inputProps={{ disabled: !canEdit }}
          />

          <PermissionsField
            name={`${namespace}.beginInUninfestedArea`}
            permission={INVASIVE_PLANTS.ITEMS}
            component={FieldCheckbox}
            label="Any work will begin in un-infested areas before moving to infested locations"
            displayValue={beginInUninfestedArea}
            fast
            inline
            inputProps={{ disabled: !canEdit }}
          />

          <PermissionsField
            name={`${namespace}.undercarrigesInspected`}
            permission={INVASIVE_PLANTS.ITEMS}
            component={FieldCheckbox}
            label="Clothing and vehicle/equipment undercarriages will be regularly inspected for plant parts or propagules if working in an area known to contain invasive plants"
            displayValue={undercarrigesInspected}
            fast
            inline
            inputProps={{ disabled: !canEdit }}
          />

          <PermissionsField
            name={`${namespace}.revegetate`}
            permission={INVASIVE_PLANTS.ITEMS}
            component={FieldCheckbox}
            label="Revegetate disturbed areas that have exposed mineral soil within one year of disturbance by seeding using Common #1 Forage Mixture or better. The certificate of seed analysis will be requested and seed that contains weed seeds of listed invasive plants and/or invasive plants that are high priority to the area will be rejected. Seeding will occur around range developments and areas of cattle congregation where bare soil is exposed. Revegetated areas will be monitored and revegetated as necessary until exposed soil is eliminated."
            displayValue={revegetate}
            fast
            inline
            inputProps={{ disabled: !canEdit }}
          />

          <FormControlLabel
            control={
              <MuiCheckbox
                checked={otherChecked}
                disabled={!canEdit}
                onChange={() => {
                  setOtherChecked(!otherChecked);
                  formik.setFieldValue(`${namespace}.other`, '');
                }}
              />
            }
            label="Other: (Please Describe)"
          />

          {otherChecked && (
            <div className="rup__ip-checklist__form__textarea">
              <PermissionsField
                permission={INVASIVE_PLANTS.ITEMS}
                name={`${namespace}.other`}
                displayValue={other}
                component={TextAreaField}
                displayComponent={MultiParagraphDisplay}
              />
            </div>
          )}
        </FormGroup>
      </div>
    </div>
  );
}

export default memo(connect(InvasivePlantChecklist));
