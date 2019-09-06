import React from 'react'

import { storiesOf } from '@storybook/react'
import LocationButton from './LocationButton'
import { action } from '@storybook/addon-actions'

storiesOf('LocationButton', module).add('Default', () => (
  <LocationButton onLocation={action('location')}>Get Location</LocationButton>
))
