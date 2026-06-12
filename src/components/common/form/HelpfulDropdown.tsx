import React from 'react';
import { useField } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import MuiIcon from '../MuiIcon';

function getOptionValue(opt: any): string | number {
  return opt.value !== undefined ? opt.value : opt.id;
}

function getOptionLabel(opt: any): string {
  return opt.label || opt.text || opt.description || opt.name || '';
}

interface HelpfulDropdownProps {
  help: string;
  label?: string;
  name: string;
  options?: any[];
  placeholder?: string;
  search?: boolean;
  multiple?: boolean;
  allowAdditions?: boolean;
  [key: string]: any;
}

function HelpfulDropdown({
  help,
  label,
  options = [],
  placeholder,
  search: _search,
  multiple,
  allowAdditions,
  ...props
}: HelpfulDropdownProps) {
  const fieldName = props.field?.name || props.name;
  const [field, meta, helpers] = useField(fieldName);

  const value = multiple
    ? (options || []).filter((opt: any) => (field.value || []).includes(getOptionValue(opt)))
    : (options || []).find((opt: any) => getOptionValue(opt) === field.value) || null;

  return (
    <>
      <Autocomplete
        value={value}
        onChange={(_, newValue) => {
          if (multiple) {
            helpers.setValue(((newValue as any[]) || []).map(getOptionValue));
          } else {
            helpers.setValue(newValue ? getOptionValue(newValue as any) : '');
          }
        }}
        onBlur={() => helpers.setTouched(true)}
        options={options || []}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(opt, val) => getOptionValue(opt) === getOptionValue(val)}
        multiple={multiple}
        freeSolo={allowAdditions}
        disableClearable
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {help && (
                    <Tooltip title={help}>
                      <MuiIcon
                        name="question circle outline"
                        color="blue"
                        size="small"
                        style={{ marginLeft: 4, cursor: 'pointer' }}
                      />
                    </Tooltip>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>
  );
}

export default HelpfulDropdown;
