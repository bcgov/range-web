import React from 'react'
import ReactSelect from 'react-select'
import { connect, getIn } from 'formik'

const Select = ({ name, formik, onChange, options = [], inputProps }) => {
  const currentValue = getIn(formik.values, name)
  const selectedOption = options.find(f => f.value === currentValue)

  const error = getIn(formik.errors, name)
  const isError = Boolean(error)

  return (
    <ReactSelect
      {...inputProps}
      name={name}
      options={options}
      value={selectedOption}
      onChange={({ value }) => {
        formik.setFieldValue(name, value)
        if (onChange && typeof onChange === 'function') {
          onChange(value)
        }
      }}
      isSearchable
      styles={{
        container: styles => ({
          ...styles,
          width: '170px'
        }),
        control: styles => ({
          ...styles,
          borderColor: isError ? '#e0b4b4' : styles.borderColor,
          background: isError ? '#fff6f6' : styles.background,
          color: isError ? '#9f3a38' : styles.color
        })
      }}
      menuPortalTarget={document.body}
    />
  )
}

export default connect(Select)
