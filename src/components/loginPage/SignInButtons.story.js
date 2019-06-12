import React from 'react'

import { storiesOf } from '@storybook/react'

import SignInButtons from './SignInButtons'

const stories = storiesOf('SignInButtons', module)
stories.add('Default', () => <SignInButtons />)
