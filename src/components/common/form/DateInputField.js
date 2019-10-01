import React from 'react'
import PropTypes from 'prop-types'
import { DateInput } from 'semantic-ui-calendar-react'
import { Field, getIn } from 'formik'
import moment from 'moment'

const DateInputField = ({ inline, ...props }) => (
  <Field
    {...props}
    inline={inline}
    render={({ field, form }) => {
      const error = getIn(form.errors, field.name)

      return (
        <>
          <DateInput
            {...field}
            {...props}
            inlineLabel={inline}
            onChange={(e, { value }) => {
              const date = moment(value, props.dateFormat).toISOString()
              form.setFieldValue(field.name, date)
            }}
            value={
              field.value ? moment(field.value).format(props.dateFormat) : ''
            }
            onBlur={() => form.setFieldTouched(field.name)}
            error={!!error}
          />
          {error && (
            <span
              className="sui-error-message"
              style={{ position: 'relative', top: '-1em' }}>
              {error}
            </span>
          )}
        </>
      )
    }}></Field>
)

DateInputField.propTypes = {
  inline: PropTypes.bool
}

export default DateInputField
