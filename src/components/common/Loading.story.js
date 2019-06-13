import React from 'react'

import { storiesOf } from '@storybook/react'
import Loading from './Loading'

storiesOf('Loading', module)
  .add('Default', () => <Loading />)

  .add('Not inverted', () => <Loading inverted={false} />)

  .add('Not active', () => <Loading active={false} />)

  .add('Only spinner is true', () => <Loading onlySpinner={true} />)

  .add('Only spinner is false', () => <Loading onlySpinner={false} />)

  .add('Small', () => <Loading size={'small'} />)

  .add('Medium', () => <Loading size={'medium'} />)
