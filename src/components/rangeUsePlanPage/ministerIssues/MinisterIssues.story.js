import React from 'react'
import { storiesOf } from '@storybook/react'
import moment from 'moment'

import MinisterIssues from './MinisterIssues'

const issues = [
  {
    id: 8,
    type: 'Community Watershed',
    detail: 'This is a pretty big issue',
    objective: 'Our objective is to address the issue....',
    identified: true,
    pastures: [{ name: 'Zobnik' }],
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

storiesOf('rangeUsePlanPage/ministerIssues/MinisterIssues', module)
  .add('With Content', () => <MinisterIssues issues={issues} />)
  .add('Only required fields', () => (
    <MinisterIssues issues={[{ id: issues[0].id, type: issues[0].type }]} />
  ))
