import React from 'react';

import { storiesOf } from '@storybook/react';

import BrowserWarningHeader from './BrowserWarningHeader';

storiesOf('loginPage/BrowserWarningHeader', module).add('Default', () => (
  <BrowserWarningHeader />
));
