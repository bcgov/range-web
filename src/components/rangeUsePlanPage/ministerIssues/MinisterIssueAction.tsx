import React, { useState } from 'react';
import { NO_DESCRIPTION } from '../../../constants/strings';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { MINISTER_ISSUES } from '../../../constants/fields';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import DayMonthPicker from '../../common/form/DayMonthPicker';
import moment from 'moment';
import { MuiIcon } from '../../common';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useField } from 'formik';

function FormikSelect(props: any) {
  const { options, label } = props;
  const [field, meta] = useField(props.name);
  return (
    <TextField
      select
      {...field}
      label={label}
      value={field.value ?? ''}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
      fullWidth
      size="small"
    >
      {options.map((opt: any) => (
        <MenuItem key={opt.key || opt.value} value={opt.value}>
          {opt.text || opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

function TextAreaField(props: any) {
  const { name, inputProps, label, displayValue } = props;
  const [field, meta] = useField(name);
  const showReadOnly = !!displayValue && !meta.value;
  if (showReadOnly) {
    return <TextField label={label} value={displayValue} fullWidth disabled multiline minRows={3} />;
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
      minRows={3}
    />
  );
}

interface MinisterIssueActionProps {
  actionTypeId: any;
  detail: string;
  other: string;
  noGrazeStartMonth: number;
  noGrazeStartDay: number;
  noGrazeEndMonth: number;
  noGrazeEndDay: number;
  namespace: string;
  onDelete: () => void;
}

function MinisterIssueAction({
  actionTypeId,
  detail,
  other,
  noGrazeStartMonth,
  noGrazeStartDay,
  noGrazeEndMonth,
  noGrazeEndDay,
  namespace,
  onDelete,
}: MinisterIssueActionProps) {
  const types = (useReferences() as any)[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
  const type = types.find((t: any) => t.id === actionTypeId)?.name ?? '';
  const options = types.map((t: any) => ({
    key: t.id,
    value: t.id,
    text: t.name,
    id: t.id,
  }));

  const isOtherType = type === 'Other';
  const isActionTypeTiming = type === 'Timing';

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const noGrazePeriod = (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <PermissionsField
          permission={MINISTER_ISSUES.ACTIONS.NO_GRAZING_PERIOD}
          monthName={`${namespace}.noGrazeStartMonth`}
          dayName={`${namespace}.noGrazeStartDay`}
          component={DayMonthPicker}
          label="No Grazing Period Start"
          displayValue={moment(`${noGrazeStartMonth} ${noGrazeStartDay}`, 'MM DD').format('MMMM Do')}
        />
      </Grid>
      <Grid item xs={6}>
        <PermissionsField
          permission={MINISTER_ISSUES.ACTIONS.NO_GRAZING_PERIOD}
          monthName={`${namespace}.noGrazeEndMonth`}
          dayName={`${namespace}.noGrazeEndDay`}
          component={DayMonthPicker}
          label="No Grazing Period End"
          displayValue={moment(`${noGrazeEndMonth} ${noGrazeEndDay}`, 'MM DD').format('MMMM Do')}
        />
      </Grid>
    </Grid>
  );

  return (
    <div className="rup__missue__action">
      <div className="rup__missue__action__dropdown-ellipsis-container">
        <Grid container spacing={2}>
          <Grid item xs={isOtherType ? 6 : 12}>
            <PermissionsField
              permission={MINISTER_ISSUES.ACTIONS.NAME}
              name={`${namespace}.actionTypeId`}
              displayValue={isOtherType ? 'Other:' : type}
              component={FormikSelect}
              options={options}
            />
          </Grid>
          {isOtherType && (
            <Grid item xs={6}>
              <PermissionsField
                permission={MINISTER_ISSUES.ACTIONS.NAME}
                name={`${namespace}.other`}
                displayValue={other}
                inputProps={{
                  placeholder: 'Other type',
                }}
              />
            </Grid>
          )}
        </Grid>

        <IfEditable permission={MINISTER_ISSUES.ACTIONS.NAME}>
          <IconButton
            onClick={(e: React.MouseEvent<HTMLElement>) => {
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
            onClick={(e: React.MouseEvent) => {
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
        </IfEditable>
      </div>
      <div className="rup__missue__action__detail">
        {isActionTypeTiming && noGrazePeriod}

        <PermissionsField
          permission={MINISTER_ISSUES.ACTIONS.DETAIL}
          name={`${namespace}.detail`}
          component={TextAreaField}
          displayValue={detail || NO_DESCRIPTION}
          label="Description"
          inputProps={{
            placeholder:
              types.find((t: any) => t.id === actionTypeId)?.placeholder ??
              types.find((t: any) => t.name === 'Other')?.placeholder,
          }}
          fieldProps={{ required: true }}
        />
      </div>
    </div>
  );
}

export default MinisterIssueAction;
