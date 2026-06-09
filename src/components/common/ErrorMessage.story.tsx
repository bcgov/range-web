import React from 'react';

import { storiesOf } from '@storybook/react';

import ErrorMessage from './ErrorMessage';

storiesOf('Error Message', module)
  .add('Message', () => <ErrorMessage message={'This is an error message'} />)

  .add('With warning', () => <ErrorMessage message={'This is an error message'} warning={true} />);
