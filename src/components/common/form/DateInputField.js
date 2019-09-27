import React from 'react'
import PropTypes from 'prop-types'
import { DateInput } from 'semantic-ui-calendar-react'
import { Field } from 'formik'
import moment from 'moment'

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
          const date = moment(value, props.dateFormat).toISOString()
          form.setFieldValue(field.name, date)
        }}
        value={field.value ? moment(field.value).format(props.dateFormat) : ''}
        onBlur={() => form.setFieldTouched(field.name)}
      />
    )}></Field>
)

DateInputField.propTypes = {
  inline: PropTypes.bool
}

export default DateInputField
