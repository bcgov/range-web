import React from 'react'

import { storiesOf } from '@storybook/react'
import ErrorPage from './ErrorPage'

storiesOf('Error Page', module).add('Message', () => (
  <ErrorPage
    message={`
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Phasellus vel venenatis purus, vitae viverra ex. Nulla ac
      nisl aliquam, eleifend neque vitae, feugiat magna. Nunc
      venenatis dui et odio pulvinar tincidunt. Nunc in maximus
      est, at faucibus elit.
    `}
  />
))
