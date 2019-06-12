import React from 'react'

import Status from './Status'
import { PLAN_STATUS } from '../../constants/variables'
import { USER_ROLE } from '../../constants/variables'

import { storiesOf } from '@storybook/react'
import { withKnobs, select } from '@storybook/addon-knobs'

let statusPropOptions = {}
const statusSelectOptions = Object.keys(PLAN_STATUS)
statusSelectOptions.forEach(
  status => (statusPropOptions[status] = { code: PLAN_STATUS[status] })
)

const userPropOptions = {
  'Agreement Holder': { roles: [USER_ROLE.AGREEMENT_HOLDER] },
  'Not Agreement Holder': { roles: [] }
}

storiesOf('Status', module)
  .addDecorator(withKnobs)
  .add('With knobs', () => (
    <Status
      user={select(
        'User',
        userPropOptions,
        userPropOptions['Agreement Holder'],
        ''
      )}
      status={select('Plan Status', statusPropOptions, { code: 'SFD' })}
    />
  ))
