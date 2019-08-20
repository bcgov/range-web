import React from 'react'
import { storiesOf } from '@storybook/react'
import moment from 'moment'

import { providerDecorator } from '../../decorators'
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

storiesOf('rangeUsePlanPage/ministerIssues/ministerIssues', module)
  .addDecorator(providerDecorator)
  .add('With Content', () => <MinisterIssues issues={issues} />)
