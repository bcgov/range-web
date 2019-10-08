import React from 'react'
import { getIn, connect } from 'formik'
import moment from 'moment'
import { DateInput } from 'semantic-ui-calendar-react'

const DayMonthPicker = ({ dayName, monthName, label, formik, ...props }) => {
  const month = getIn(formik.values, monthName)
  const day = getIn(formik.values, dayName)
  const error = getIn(formik.errors, monthName)
  return (
    <>
      <DateInput
        onChange={(e, { value }) => {
          const date = moment(value, 'MMMM Do')
          const month = date.month() + 1
          const day = date.date()

          formik.setFieldValue(monthName, month)
          formik.setFieldValue(dayName, day)
        }}
        value={
          day && month
            ? `${moment(month, 'MM').format('MMMM')} ${moment(day, 'DD').format(
                'Do'
              )} `
            : ''
        }
        dateFormat={'MMMM Do'}
        label={label}
        error={!!error}
        {...props}
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
}

export default connect(DayMonthPicker)
