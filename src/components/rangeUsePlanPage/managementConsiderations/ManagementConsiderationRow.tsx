import React, { useState } from 'react';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { MANAGEMENT_CONSIDERATIONS } from '../../../constants/fields';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { MuiIcon } from '../../common';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
  const placeholder = inputProps?.placeholder;
  return (
    <TextField
      {...field}
      label={label}
      placeholder={placeholder}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
      fullWidth
      multiline
      minRows={3}
    />
  );
}

interface ManagementConsiderationRowProps {
  namespace: string;
  managementConsideration: any;
  onDelete: () => void;
}

function ManagementConsiderationRow({ namespace, managementConsideration, onDelete }: ManagementConsiderationRowProps) {
  const { detail, url, considerationTypeId } = managementConsideration;
  const references = useReferences();
  const considerTypes = (references as any)[REFERENCE_KEY.MANAGEMENT_CONSIDERATION_TYPE] || [];
  const considerTypeOptions = considerTypes.map((ct: any) => ({
    key: ct.id,
    value: ct.id,
    text: ct.name,
  }));

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <div className="rup__m-consideration__row">
      <div>
        <PermissionsField
          permission={MANAGEMENT_CONSIDERATIONS.TYPE}
          name={`${namespace}.considerationTypeId`}
          component={FormikSelect}
          options={considerTypeOptions}
          label={'Considerations'}
          displayValue={
            considerTypes.find((type: any) => type.id === considerationTypeId)
              ? considerTypes.find((type: any) => type.id === considerationTypeId).name
              : ''
          }
          inputProps={{
            fluid: true,
          }}
        />
      </div>
      <div>
        <PermissionsField
          permission={MANAGEMENT_CONSIDERATIONS.DESCRIPTION}
          name={`${namespace}.detail`}
          component={TextAreaField}
          displayValue={detail}
          label={'Details'}
          fieldProps={{ required: true }}
        />
        <PermissionsField
          permission={MANAGEMENT_CONSIDERATIONS.DESCRIPTION}
          name={`${namespace}.url`}
          displayValue={url}
          label={'URL'}
        />
      </div>

      <IfEditable permission={[MANAGEMENT_CONSIDERATIONS.DELETE]} any>
        <div className="rup__m-consideration__ellipsis">
          <IconButton
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              setMenuAnchorEl(e.currentTarget);
            }}
            size="small"
            style={{ marginLeft: '5px', marginTop: '10px' }}
          >
            <MuiIcon name="ellipsis vertical" style={{ margin: '0' }} />
          </IconButton>
          <Menu anchorEl={menuAnchorEl} open={!!menuAnchorEl} onClose={() => setMenuAnchorEl(null)}>
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

export default ManagementConsiderationRow;
