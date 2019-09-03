import React from 'react'
import { DateInput } from 'semantic-ui-calendar-react'
import { Field } from 'formik'

const DateInputField = props => (
  <Field
    {...props}
    render={({ field, form }) => (
      <DateInput
        {...field}
        {...props}
        onChange={(e, { value }) => {
          form.setFieldValue(field.name, value)
        }}
        onBlur={() => form.setFieldTouched(field.name)}
      />
    )}></Field>
)

export default DateInputField
