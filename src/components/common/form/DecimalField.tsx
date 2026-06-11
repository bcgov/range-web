import React from 'react';
import { Field, FastField, getIn } from 'formik';
import { Form, Input } from 'semantic-ui-react';
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

interface DecimalInputProps {
  name: string;
  label?: string;
  inputProps: Record<string, any>;
  fieldProps: Record<string, any>;
  errorComponent: React.ComponentType<{ message: string }>;
  inputRef?: (el: HTMLInputElement | null) => void;
  form: any;
  field: any;
}

function DecimalInput({
  name,
  label,
  inputProps,
  fieldProps,
  errorComponent,
  inputRef,
  form,
  field,
}: DecimalInputProps) {
  const { onChange, ...safeInputProps } = inputProps;
  const id = `decimal_field_${name}`;

  const error = getIn(form.errors, name);
  const touched = getIn(form.touched, name);

  return (
    <Form.Field error={!!error} {...fieldProps}>
      {!!label && <label htmlFor={id}>{label}</label>}

      <InputRef inputRef={inputRef}>
        <Input
          id={id}
          name={name}
          type="number"
          {...safeInputProps}
          value={touched ? field.value : parseFloat(field.value).toFixed(1)}
          onBlur={(...args: any[]) => {
            if (!isNaN(parseFloat(field.value))) {
              form.setFieldValue(field.name, parseFloat(field.value).toFixed(1));
            }

            form.handleBlur(...args);
          }}
          onChange={(_e: any, { name: fieldName, value }: any) => {
            form.setFieldValue(field.name, value);
            form.setFieldTouched(field.name, true);
            Promise.resolve().then(() => {
              onChange && onChange(_e, { name: fieldName, value });
            });
          }}
        />
      </InputRef>

      {error &&
        React.createElement(errorComponent, {
          message: error,
        })}
    </Form.Field>
  );
}

function DecimalField({
  name,
  label,
  validate,
  inputProps = {},
  fieldProps = {},
  errorComponent = ErrorMessage,
  inputRef,
  fast,
}: DecimalFieldProps) {
  const DesiredField = fast === true ? FastField : Field;

  return (
    <DesiredField
      name={name}
      validate={validate}
      render={({ field, form }: any) => (
        <DecimalInput
          name={name}
          field={field}
          form={form}
          label={label}
          fieldProps={fieldProps}
          errorComponent={errorComponent}
          inputRef={inputRef}
          inputProps={inputProps}
        />
      )}
    />
  );
}

export default DecimalField;
