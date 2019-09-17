import React from 'react'
import { storiesOf } from '@storybook/react'
import moment from 'moment'

import MinisterIssues from './'
import { Form } from 'formik-semantic-ui'

const ministerIssues = [
  {
    id: 8,
    type: { name: 'Community Watershed' },
    detail: 'This is a pretty big issue',
    objective: 'Our objective is to address the issue....',
    identified: true,
    pastures: [0, 1],
    actions: [
      {
        id: 1,
        type: 'Timing',
        detail: 'Issue actions details yo!',
        noGrazeEndDate: moment()
          .add(3, 'months')
          .toDate(),
        noGrazeStartDate: moment()
          .add(1, 'month')
          .toDate()
      }
    ]
  }
]

const pastures = [
  { name: 'Pasture 1', id: 0 },
  { name: 'Pasture 2', id: 1 },
  { name: 'Pasture 3', id: 2 }
]

storiesOf('rangeUsePlanPage/ministerIssuesRefactored/MinisterIssues', module)
  .add('With Content', () => (
    <Form
      initialValues={{ ministerIssues, pastures }}
      render={({ values }) => <MinisterIssues issues={values.ministerIssues} />}
    />
  ))
  .add('Only required fields', values => (
    <Form
      initialValues={{ ministerIssues, pastures }}
      render={({ values }) => <MinisterIssues issues={values.ministerIssues} />}
    />
  ))
