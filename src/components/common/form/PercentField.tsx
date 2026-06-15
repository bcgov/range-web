import React from 'react';
import { useField } from 'formik';
import omit from 'lodash/omit';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { InputRef } from './InputRef';
import ErrorMessage from './ErrorMessage';

export function moveDecimalsRight(inputNum: number): number {
  const numAsStr = inputNum.toFixed(2);
  const numAfterDecimalsStr = numAsStr.substring(2, 4);
  return parseFloat(numAfterDecimalsStr);
}

interface PercentFieldProps {
  name: string;
  label?: string;
  validate?: (value: any) => string | undefined;
  inputProps?: Record<string, any>;
  fieldProps?: Record<string, any>;
  errorComponent?: React.ComponentType<{ message: string }>;
  inputRef?: (el: HTMLInputElement | null) => void;
  fast?: boolean;
}

function PercentField({
  name,
  label,
  validate,
  inputProps = {},
  fieldProps = {},
  errorComponent = ErrorMessage,
  inputRef,
  fast: _fast,
}: PercentFieldProps) {
  const [field, meta, helpers] = useField({ name, validate });
  const { onChange, ...safeInputProps } = omit(inputProps, ['label', 'labelPosition']);
  const id = `percent_field_${name}`;

  const displayValue =
    field.value !== undefined && field.value !== '' && !isNaN(parseFloat(field.value))
      ? moveDecimalsRight(parseFloat(field.value)).toString()
      : '';

  return (
    <div {...fieldProps}>
      {!!label && (
        <label htmlFor={id} style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>
          {label}
        </label>
      )}
      <InputRef inputRef={inputRef}>
        <TextField
          id={id}
          name={name}
          type="number"
          value={displayValue}
          error={meta.touched && !!meta.error}
          size="small"
          {...safeInputProps}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            ...(safeInputProps.InputProps || {}),
          }}
          onChange={(e) => {
            const raw = e.target.value;
            const num = parseFloat(raw);
            helpers.setValue(isNaN(num) ? raw : num / 100);
            Promise.resolve().then(() => {
              onChange && onChange(e, { name, value: raw });
            });
          }}
          onBlur={(e) => {
            if (!isNaN(parseFloat(field.value))) {
              helpers.setValue(Math.round(parseFloat(field.value) * 100) / 100);
            }
            helpers.setTouched(true);
            inputProps.onBlur?.(e);
          }}
        />
      </InputRef>
      {meta.touched && meta.error && React.createElement(errorComponent, { message: meta.error })}
    </div>
  );
}

export default PercentField;
