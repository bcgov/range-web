import React from 'react';
import { Field, FastField, getIn } from 'formik';
import { Form, Input } from 'semantic-ui-react';
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

const PercentField: React.FC<PercentFieldProps> = ({
  name,
  label,
  validate,
  inputProps = {},
  fieldProps = {},
  errorComponent = ErrorMessage,
  inputRef,
  fast,
}) => {
  const id = `percent_field_${name}`;
  const { onChange, ...safeInputProps } = inputProps;
  const DesiredField = fast === true ? FastField : Field;

  return (
    <DesiredField
      name={name}
      validate={validate}
      render={({ field, form }: any) => {
        const error = getIn(form.errors, name);

        return (
          <Form.Field error={!!error} {...fieldProps}>
            {!!label && <label htmlFor={id}>{label}</label>}

            <InputRef inputRef={inputRef}>
              <Input
                id={id}
                name={name}
                {...safeInputProps}
                value={!isNaN(parseFloat(field.value)) ? moveDecimalsRight(field.value) : field.value}
                onChange={(e: any, { name: fieldName, value }: any) => {
                  form.setFieldValue(field.name, !isNaN(parseFloat(value)) ? value / 100 : value.trim());
                  Promise.resolve().then(() => {
                    onChange && onChange(e, { name: fieldName, value });
                  });
                }}
                onBlur={(...args: any[]) => {
                  form.setFieldValue(
                    field.name,
                    !isNaN(parseFloat(field.value)) ? moveDecimalsRight(field.value) / 100 : field.value,
                  );
                  form.handleBlur(...args);
                }}
              />
            </InputRef>

            {error &&
              React.createElement(errorComponent, {
                message: error,
              })}
          </Form.Field>
        );
      }}
    />
  );
};

export default PercentField;
