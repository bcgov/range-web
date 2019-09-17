import React from 'react'
import { storiesOf } from '@storybook/react'
import { Form } from 'formik-semantic-ui'

import AdditionalRequirements from '.'

const additionalRequirements = [
  {
    id: 1,
    detail: 'Details, details.',
    url: 'http://example.com',
    category: 4
  },
  {
    id: 2,
    detail: 'Lorem ipsum something something',
    url: 'http://example.com',
    category: 3
  },
  {
    id: 3,
    detail: 'bęéëēp',
    url: 'http://example.com',
    category: 3
  }
]

storiesOf('rangeUsePlanPage/additionalRequirements', module).add(
  'default',
  () => (
    <Form
      initialValues={{
        additionalRequirements
      }}
      render={({ values }) => (
        <AdditionalRequirements
          additionalRequirements={values.additionalRequirements}
        />
      )}
    />
  )
)
