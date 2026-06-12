import React, { useCallback } from 'react';
import { useField } from 'formik';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { ADDITIONAL_REQUIREMENTS } from '../../../constants/fields';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import MuiIcon from '../../common/MuiIcon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextFieldMui from '@mui/material/TextField';

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

function CategorySelect(props: any) {
  const { options, inputProps } = props;
  const [field, meta] = useField(props.name);
  return (
    <TextFieldMui
      select
      {...field}
      {...inputProps}
      label={props.label}
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
    </TextFieldMui>
  );
}

interface AdditionalRequirementRowProps {
  additionalRequirement: any;
  namespace: string;
  onDelete: () => void;
  onCopy: () => void;
}

function AdditionalRequirementRow({
  additionalRequirement,
  namespace,
  onDelete,
  onCopy,
}: AdditionalRequirementRowProps) {
  const references = useReferences();

  const categories = (references as any)[REFERENCE_KEY.ADDITIONAL_REQUIREMENT_CATEGORY];
  const options = categories.map((category: any) => ({
    key: category.id,
    value: category.id,
    text: category.name,
  }));

  const { detail, url, categoryId } = additionalRequirement;

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  return (
    <div className="rup__a-requirement__row">
      <PermissionsField
        permission={ADDITIONAL_REQUIREMENTS.CATEGORY}
        inputProps={{ placeholder: 'Category' }}
        name={`${namespace}.categoryId`}
        component={CategorySelect}
        options={options}
        displayValue={
          options.find((c: any) => c.value === categoryId) ? options.find((c: any) => c.value === categoryId).text : ''
        }
        label="Category"
        fast
        fieldProps={{ required: true }}
      />
      <div>
        <PermissionsField
          permission={ADDITIONAL_REQUIREMENTS.DESCRIPTION}
          name={`${namespace}.detail`}
          component={TextAreaField}
          displayValue={detail}
          inputProps={{
            placeholder: 'Name, date, summary (ex. WHA Badger #8-329/#8-330, 2009, attractants and stubble heights)',
          }}
          label="Details"
          fast
          fieldProps={{ required: true }}
        />

        <PermissionsField
          permission={ADDITIONAL_REQUIREMENTS.URL}
          name={`${namespace}.url`}
          displayValue={url}
          label="URL"
          inputProps={{ placeholder: 'URL', fluid: true }}
          fast
        />
      </div>
      <IfEditable permission={ADDITIONAL_REQUIREMENTS.NAME}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 15,
          }}
        >
          <IconButton onClick={handleMenuOpen} size="small">
            <MuiIcon name="ellipsis vertical" />
          </IconButton>
          <Menu anchorEl={menuAnchorEl} open={!!menuAnchorEl} onClose={handleMenuClose} onClick={handleMenuClose}>
            <MenuItem
              onClick={() => {
                onDelete();
              }}
            >
              Delete
            </MenuItem>
            <MenuItem
              onClick={() => {
                onCopy();
              }}
            >
              Copy
            </MenuItem>
          </Menu>
        </div>
      </IfEditable>
    </div>
  );
}

export default React.memo(AdditionalRequirementRow);
