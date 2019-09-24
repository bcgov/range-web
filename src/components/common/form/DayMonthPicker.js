import React from 'react'
import { getIn, connect } from 'formik'
import moment from 'moment'
import { DateInput } from 'semantic-ui-calendar-react'

const DayMonthPicker = ({ dayName, monthName, label, formik, ...props }) => {
  return (
    <>
      <DateInput
        onChange={(e, { value }) => {
          const date = moment(value, 'MMMM Do')
          const month = date.month() + 1
          const day = date.date()

          console.log(month, day)
          formik.setFieldValue(monthName, month)
          formik.setFieldValue(dayName, day)
        }}
        value={`${moment(getIn(formik.values, monthName), 'MM').format(
          'MMMM'
        )} ${moment(getIn(formik.values, dayName), 'DD').format('Do')} `}
        dateFormat={'MMMM Do'}
        label={label}
        {...props}
      />
    </>
  )
}

export default connect(DayMonthPicker)
