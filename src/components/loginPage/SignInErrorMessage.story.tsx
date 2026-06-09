import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SignInErrorMessage from './SignInErrorMessage';

const stories = storiesOf('loginPage/SignInErrorMessage', module);
stories.add('Default', () => <SignInErrorMessage />);
stories.add('error fetching user', () => (
  <SignInErrorMessage
    errorFetchingUser={{ status: 403, data: { error: 'error message' } }}
    signOut={action('sign out clicked')}
  />
));
stories.add('non 403 error', () => (
  <SignInErrorMessage errorFetchingUser={{ status: 404, data: { error: 'error message' } }} />
));
