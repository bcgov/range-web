import React from 'react'

import Status from './Status'
import { PLAN_STATUS } from '../../constants/variables'
import { USER_ROLE } from '../../constants/variables'

import { storiesOf } from '@storybook/react'
import { withKnobs, select } from '@storybook/addon-knobs'

const userPropOptions = {
  'Agreement Holder': { roles: [USER_ROLE.AGREEMENT_HOLDER] },
  'Not Agreement Holder': { roles: [] }
}

const statusPropOptions = Object.fromEntries(
  Object.entries(PLAN_STATUS).map(([status, code]) => [status, { code }])
)

storiesOf('Status', module)
  .addDecorator(withKnobs)
  .add('With Knobs', () => (
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
