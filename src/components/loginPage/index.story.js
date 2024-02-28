import React from 'react';

import { storiesOf } from '@storybook/react';
import { providerDecorator } from '../decorators';

import { LoginPage } from './';

const stories = storiesOf('loginPage/LoginPage', module);
stories.addDecorator(providerDecorator);
stories.add('Default', () => <LoginPage />);
