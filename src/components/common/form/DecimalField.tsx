import React from 'react';
import { useField } from 'formik';
import TextField from '@mui/material/TextField';
import { InputRef } from './InputRef';
import ErrorMessage from './ErrorMessage';

interface DecimalFieldProps {
  name: string;
  label?: string;
  validate?: (value: any) => string | undefined;
  inputProps?: Record<string, any>;
  fieldProps?: Record<string, any>;
  errorComponent?: React.ComponentType<{ message: string }>;
  inputRef?: (el: HTMLInputElement | null) => void;
  fast?: boolean;
}

function DecimalField({
  name,
  label,
  validate,
  inputProps = {},
  fieldProps = {},
  errorComponent = ErrorMessage,
  inputRef,
  fast: _fast,
}: DecimalFieldProps) {
  const [field, meta, helpers] = useField({ name, validate });
  const { onChange, ...safeInputProps } = inputProps;
  const id = `decimal_field_${name}`;

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
          value={field.value ?? ''}
          error={meta.touched && !!meta.error}
          size="small"
          {...safeInputProps}
          onChange={(e) => {
            helpers.setValue(e.target.value);
            helpers.setTouched(true);
            Promise.resolve().then(() => {
              onChange && onChange(e, { name, value: e.target.value });
            });
          }}
          onBlur={(e) => {
            if (!isNaN(parseFloat(field.value))) {
              helpers.setValue(parseFloat(field.value).toFixed(1));
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

export default DecimalField;
