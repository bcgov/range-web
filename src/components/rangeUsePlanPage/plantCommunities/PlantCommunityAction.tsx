import React, { useState, useRef } from 'react';
import { connect, useField } from 'formik';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { MuiIcon } from '../../common';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { PLANT_COMMUNITY } from '../../../constants/fields';
import DayMonthPicker from '../../common/form/DayMonthPicker';
import moment from 'moment';
import HelpfulDropdown from '../../common/form/HelpfulDropdown';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

function TextAreaField(props: any) {
  const { name, inputProps, label, displayValue } = props;
  const [field, meta] = useField(name);
  const showReadOnly = !!displayValue && !meta.value;
  if (showReadOnly) {
    return <TextField label={label} value={displayValue} fullWidth disabled multiline minRows={5} />;
  }
  return (
    <TextField
      {...field}
      {...inputProps}
      label={label}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
      fullWidth
      multiline
      minRows={5}
    />
  );
}

interface PlantCommunityActionProps {
  action: any;
  namespace: string;
  onDelete: () => void;
  formik?: any;
}

function PlantCommunityAction({ action, namespace, onDelete, formik }: PlantCommunityActionProps) {
  const references = useReferences() as any;
  const placeholders = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE];
  const actionTypes = references[REFERENCE_KEY.PLANT_COMMUNITY_ACTION_TYPE].map((type: any) => ({
    placeholder: placeholders.find((p: any) => p.id === type.id)?.placeholder,
    ...type,
  }));

  const otherType = actionTypes.find((type: any) => type.name === 'Other');
  const [otherOption, setOtherOption] = useState({
    key: otherType?.id,
    value: otherType?.id,
    text: action?.name || otherType?.name || 'Other',
  });

  const actionOptions = actionTypes
    .map((type: any) => ({
      key: type.id,
      value: type.id,
      text: type.name,
    }))
    .concat(otherOption)
    .filter((o: any) => o.text !== 'Other');

  const valueInputRef = useRef<any>(null);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={{ flex: 4 }}>
        <PermissionsField
          name={`${namespace}.actionTypeId`}
          permission={PLANT_COMMUNITY.ACTIONS.NAME}
          component={HelpfulDropdown}
          help="To select a value, start typing. If a predefined option doesn't exist, you can provide your own value"
          options={actionOptions}
          displayValue={
            actionOptions.find((option: any) => option.value === action.actionTypeId)
              ? actionOptions.find((option: any) => option.value === action.actionTypeId).text
              : ''
          }
          label="Action"
          fieldProps={{
            required: true,
          }}
          inputProps={{
            allowAdditions: true,
            search: true,
            fluid: true,
            additionLabel: 'Other: ',
            selectOnBlur: true,
            onKeyDown: (e: any) => {
              if (e.keyCode === 13) {
                valueInputRef.current?.focus();
              }
            },
            onAddItem: (_e: any, { value }: any) => {
              setOtherOption({
                ...otherOption,
                text: value,
              });

              formik.setFieldValue(`${namespace}.actionTypeId`, otherOption.value);
              formik.setFieldValue(`${namespace}.name`, value);
            },
          }}
        />
      </div>

      <div style={{ flex: 11 }}>
        <PermissionsField
          name={`${namespace}.details`}
          permission={PLANT_COMMUNITY.ACTIONS.DETAIL}
          displayValue={action.details}
          component={TextAreaField}
          label="Details"
          fieldProps={{
            required: true,
          }}
          inputProps={{
            ref: valueInputRef,
            placeholder:
              actionTypes?.find((type: any) => type.id === action.actionTypeId)?.placeholder ?? otherType?.placeholder,
          }}
        />

        {actionOptions.find((option: any) => option.value === action.actionTypeId) &&
          actionOptions.find((option: any) => option.value === action.actionTypeId).text === 'Timing' && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <PermissionsField
                  monthName={`${namespace}.noGrazeStartMonth`}
                  dayName={`${namespace}.noGrazeStartDay`}
                  permission={PLANT_COMMUNITY.ACTIONS.NO_GRAZING_PERIOD}
                  displayValue={moment(`${action.noGrazeStartMonth} ${action.noGrazeStartDay}`, 'MM DD').format(
                    'MMMM Do',
                  )}
                  component={DayMonthPicker}
                  label="No Graze Start"
                  fluid
                />
              </div>
              <div style={{ flex: 1 }}>
                <PermissionsField
                  monthName={`${namespace}.noGrazeEndMonth`}
                  dayName={`${namespace}.noGrazeEndDay`}
                  permission={PLANT_COMMUNITY.ACTIONS.NO_GRAZING_PERIOD}
                  displayValue={moment(`${action.noGrazeEndMonth} ${action.noGrazeEndDay}`, 'MM DD').format('MMMM Do')}
                  component={DayMonthPicker}
                  label="No Graze End"
                  fluid
                />
              </div>
            </div>
          )}
      </div>

      <IfEditable permission={PLANT_COMMUNITY.ACTIONS.NAME}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: '40px', justifyContent: 'center' }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchorEl(e.currentTarget);
            }}
            size="small"
          >
            <MuiIcon name="ellipsis vertical" />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={!!menuAnchorEl}
            onClose={() => setMenuAnchorEl(null)}
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchorEl(null);
            }}
          >
            <MenuItem
              onClick={() => {
                setMenuAnchorEl(null);
                onDelete();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>
      </IfEditable>
    </div>
  );
}

export default connect(PlantCommunityAction);
