import React from 'react'
import { Form } from 'semantic-ui-react'
import { Field, getIn } from 'formik'
import moment from 'moment'

const DayMonthPicker = ({ dayName, monthName, label }) => {
  const monthOptions = moment.months().map((month, i) => ({
    text: month,
    value: i + 1,
    key: month
  }))

  const dayOptionsForMonth = month => {
    if (!month || month < 1 || month > 12) return []
    const days = moment(
      monthOptions.find(m => m.value === month).text + ' ' + moment().year()
    ).daysInMonth()

    const options = Array.from({ length: days }).map((_, i) => ({
      value: i + 1,
      text: i + 1,
      key: i + 1
    }))

    return options
  }

  const monthId = `field_input_${monthName}`
  const dayId = `field_input_${dayName}`

  return (
    <>
      <Field
        name={monthName}
        render={({ field, form }) => (
          <Form.Field>
            {!!label && <label htmlFor={monthId}>{label}</label>}
            <Form.Dropdown
              id={monthId}
              name={monthName}
              placeholder="Month"
              options={monthOptions}
              onChange={(e, { name, value }) => {
                form.setFieldValue(name, value)
              }}
              selection
              fluid
              value={field.value}
            />
          </Form.Field>
        )}
      />

      <Field
        name={dayName}
        render={({ field, form }) => {
          return (
            <Form.Field>
              {!!label && <label htmlFor={dayId}>&nbsp;</label>}
              <Form.Dropdown
                id={dayId}
                name={dayName}
                placeholder="Day"
                disabled={!getIn(form.values, monthName)}
                options={dayOptionsForMonth(getIn(form.values, monthName))}
                onChange={(e, { name, value }) => {
                  form.setFieldValue(name, value)
                }}
                selection
                fluid
                value={field.value}
              />
            </Form.Field>
          )
        }}
      />
    </>
  )
}

export default DayMonthPicker
