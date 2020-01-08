import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'

import InfoTip from './InfoTip'

const stories = storiesOf('InfoTip', module)
stories.addDecorator(withKnobs)
stories.add('default', () => (
  <InfoTip header={'Example'} content={'With a short description.'} />
))
stories.add('with knobs', () => (
  <InfoTip
    header={text('Header', 'Header')}
    content={text('Content', 'Write some content')}
  />
))
