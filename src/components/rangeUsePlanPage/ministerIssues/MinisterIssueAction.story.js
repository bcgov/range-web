import React from 'react'
import { storiesOf } from '@storybook/react'
import moment from 'moment'

import MinisterIssueAction from './MinisterIssueAction'

const action = {
  type: 'Herding',
  detail: 'Issue actions details yo!'
}

storiesOf('rangeUsePlanPage/ministerIssues/MinisterIssueAction', module)
  .add('With Content', () => <MinisterIssueAction {...action} />)
  .add('Only required fields', () => <MinisterIssueAction type={action.type} />)
  .add('Timing type', () => (
    <MinisterIssueAction
      type="Timing"
      detail={action.detail}
      noGrazeEndDate={moment()
        .add(3, 'months')
        .toDate()}
      noGrazeStartDate={moment()
        .add(1, 'month')
        .toDate()}
    />
  ))
  .add('Other type', () => (
    <MinisterIssueAction
      type="Other"
      other="my other type"
      detail={action.detail}
    />
  ))
