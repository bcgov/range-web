import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'

import TextField from './TextField'

storiesOf('Text Field', module)
  .add('With Label', () => <TextField label={'With Label'} />)
  .addDecorator(withKnobs)
  .add('With Knobs', () => (
    <TextField
      label={text('Label', 'Default Label')}
      text={text('Text', 'Default Text')}
    />
  ))
