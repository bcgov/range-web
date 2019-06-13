import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { SignInBox } from './SignInBox'

const stories = storiesOf('loginPage/SignInBox', module)
stories.add('Default', () => <SignInBox />)
stories.add('isFetchingUser', () => <SignInBox isFetchingUser={true} />)
stories.add('user fetched', () => <SignInBox isFetchingUser={false} />)
stories.add('error fetching user', () => (
  <SignInBox
    isFetchingUser={false}
    errorOccuredFetchingUser={true}
    errorFetchingUser={{ status: 403, data: { error: 'error message' } }}
    signOut={action('sign out clicked')}
  />
))
