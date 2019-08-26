import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import moment from 'moment'

import MinisterIssueBox from './MinisterIssueBox'

const issue = {
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

const props = {
  ministerIssueIndex: 1,
  activeMinisterIssueIndex: 1,
  onMinisterIssueClicked: () => action('minister issue clicked')
}

storiesOf('rangeUsePlanPage/ministerIssues/MinisterIssueBox', module)
  .add('With Content', () => <MinisterIssueBox issue={issue} {...props} />)
  .add('Only required fields', () => (
    <MinisterIssueBox issue={{ type: issue.type }} {...props} />
  ))
