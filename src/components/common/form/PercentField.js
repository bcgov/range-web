import React from 'react'
import { Field, FastField, getIn } from 'formik'
import { Form, Input } from 'semantic-ui-react'
import { InputRef } from './InputRef'
import ErrorMessage from './ErrorMessage'

const PercentField = ({
  name,
  label,
  validate,
  inputProps = {},
  fieldProps = {},
  errorComponent = ErrorMessage,
  allowDecimals = false,
  inputRef,
  fast
}) => {
  const id = `percent_field_${name}`
  const { onChange, ...safeInputProps } = inputProps
  const DesiredField = fast === true ? FastField : Field

  return (
    <DesiredField
      name={name}
      validate={validate}
      render={({ field, form }) => {
        const error = getIn(form.errors, name)

        return (
          <Form.Field error={!!error} {...fieldProps}>
            {!!label && <label htmlFor={id}>{label}</label>}

            <InputRef inputRef={inputRef}>
              <Input
                id={id}
                name={name}
                {...safeInputProps}
                value={
                  !isNaN(parseFloat(field.value))
                    ? (field.value * 100).toFixed(allowDecimals ? 2 : 0)
                    : field.value
                }
                onChange={(e, { name, value }) => {
                  form.setFieldValue(
                    field.name,
                    !isNaN(parseFloat(value)) ? value / 100 : value.trim()
                  )
                  Promise.resolve().then(() => {
                    onChange && onChange(e, { name, value })
                  })
                }}
                onBlur={(...args) => {
                  if (!allowDecimals) {
                    form.setFieldValue(
                      field.name,
                      !isNaN(parseFloat(field.value))
                        ? Math.trunc(parseFloat(field.value) * 100) / 100
                        : field.value
                    )
                  }
                  form.handleBlur(...args)
                }}
              />
            </InputRef>

            {error &&
              React.createElement(errorComponent, {
                message: error
              })}
          </Form.Field>
        )
      }}
    />
  )
}

export default PercentField
