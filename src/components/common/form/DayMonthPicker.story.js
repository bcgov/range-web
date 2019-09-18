import React from 'react'

import { storiesOf } from '@storybook/react'

import { Form } from 'formik-semantic-ui'
import DayMonthPicker from './DayMonthPicker'
import PermissionsField from '../PermissionsField'
import { RANGE_READINESS } from '../../../constants/fields'
import moment from 'moment'

storiesOf('DayMonthPicker', module).add('Default', () => (
  <Form
    initialValues={{
      month: undefined,
      day: undefined
    }}
    render={({ values }) => (
      <Form.Group>
        <PermissionsField
          permission={RANGE_READINESS.DATE}
          dayName="day"
          monthName="month"
          component={DayMonthPicker}
          label="Range Readiness Date"
          displayValue={moment(`${values.month} ${values.day}`, 'MM DD').format(
            'MMMM Do'
          )}
        />
      </Form.Group>
    )}
  />
))
