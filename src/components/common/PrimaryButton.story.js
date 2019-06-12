import React from 'react'

import { storiesOf } from '@storybook/react'
import PrimaryButton from './PrimaryButton'

storiesOf('Priamry Button', module)
  .add('Default', () => <PrimaryButton />)

  .add('Inverted', () => <PrimaryButton inverted="true" />)

  .add('Inverted with children', () => (
    <PrimaryButton inverted="true">Button</PrimaryButton>
  ))

  .add('With children', () => <PrimaryButton>Button</PrimaryButton>)
