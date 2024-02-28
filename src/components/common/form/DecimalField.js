import React from 'react';
import { Field, FastField, getIn } from 'formik';
import { Form, Input } from 'semantic-ui-react';
import { InputRef } from './InputRef';
import ErrorMessage from './ErrorMessage';

const DecimalField = ({
  name,
  label,
  validate,
  inputProps = {},
  fieldProps = {},
  errorComponent = ErrorMessage,
  inputRef,
  fast,
}) => {
  const DesiredField = fast === true ? FastField : Field;

  return (
    <DesiredField
      name={name}
      validate={validate}
      render={({ field, form }) => (
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
};

const DecimalInput = ({
  name,
  label,
  inputProps,
  fieldProps,
  errorComponent,
  inputRef,
  form,
  field,
}) => {
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
          onBlur={(...args) => {
            if (!isNaN(parseFloat(field.value))) {
              form.setFieldValue(
                field.name,
                parseFloat(field.value).toFixed(1),
              );
            }

            form.handleBlur(...args);
          }}
          onChange={(e, { name, value }) => {
            form.setFieldValue(field.name, value);
            form.setFieldTouched(field.name, true);
            Promise.resolve().then(() => {
              onChange && onChange(e, { name, value });
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
};

export default DecimalField;
