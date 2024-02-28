import React from 'react';

import { storiesOf } from '@storybook/react';

import Avatar from './Avatar';

storiesOf('Avatar', module)
  .add('Default', () => <Avatar />)
  .add('with user prop', () => (
    <Avatar user={{ familyName: 'Jones', givenName: 'Jenny' }} />
  ));
