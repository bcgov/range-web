import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import providerDecorator from './providerDecorator'

import { LoginPage } from './'

const stories = storiesOf('loginPage/LoginPage', module)
stories.addDecorator(providerDecorator)
stories.add('Default', () => <LoginPage />)
