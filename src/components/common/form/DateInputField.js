import React from 'react'
import PropTypes from 'prop-types'
import { DateInput } from 'semantic-ui-calendar-react'
import { Field } from 'formik'

const DateInputField = ({ inline, ...props }) => (
  <Field
    {...props}
    inline={inline}
    render={({ field, form }) => (
      <DateInput
        {...field}
        {...props}
        inlineLabel={inline}
        onChange={(e, { value }) => {
          form.setFieldValue(field.name, value)
        }}
        onBlur={() => form.setFieldTouched(field.name)}
      />
    )}></Field>
)

DateInputField.propTypes = {
  inline: PropTypes.bool
}

export default DateInputField
