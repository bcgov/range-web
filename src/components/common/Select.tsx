import React from 'react';
import ReactSelect from 'react-select';
import { connect, getIn } from 'formik';

interface SelectOption {
  value: any;
  label: string;
}

interface SelectProps {
  name: string;
  formik: any;
  onChange?: (value: any) => void;
  options?: SelectOption[];
  inputProps?: Record<string, any>;
  [key: string]: any;
}

const Select: React.FC<SelectProps> = ({ name, formik, onChange, options = [], inputProps, ...props }) => {
  const currentValue = getIn(formik.values, name);
  const selectedOption = options.find((f) => f.value === currentValue);

  const error = getIn(formik.errors, name);
  const isError = Boolean(error);

  return (
    <ReactSelect
      {...props}
      {...inputProps}
      name={name}
      options={options}
      value={selectedOption}
      onChange={(selected: any) => {
        const value = selected?.value;
        formik.setFieldValue(name, value);
        if (onChange && typeof onChange === 'function') {
          onChange(value);
        }
      }}
      isSearchable
      styles={{
        container: (styles: any) => ({
          ...styles,
          width: '170px',
        }),
        control: (styles: any) => ({
          ...styles,
          borderColor: isError ? '#e0b4b4' : styles.borderColor,
          background: isError ? '#fff6f6' : styles.background,
          color: isError ? '#9f3a38' : styles.color,
        }),
      }}
      menuPortalTarget={document.body}
    />
  );
};

export default connect(Select);
