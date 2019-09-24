import React from 'react'
import { storiesOf } from '@storybook/react'
import { Form } from 'formik-semantic-ui'
import schema from '../schema'

import AdditionalRequirements from '.'

const additionalRequirements = [
  {
    id: 1,
    detail: 'Details, details.',
    url: 'http://example.com',
    categoryId: 4
  },
  {
    id: 2,
    detail: 'Lorem ipsum something something',
    url: 'http://example.com',
    categoryId: 3
  },
  {
    id: 3,
    detail: 'bęéëēp',
    url: 'http://example.com',
    categoryId: 3
  }
]

storiesOf('rangeUsePlanPage/additionalRequirements', module).add(
  'default',
  () => (
    <Form
      validationSchema={schema}
      validateOnChange
      initialValues={{
        additionalRequirements
      }}
      render={({ values }) => (
        <>
          <button type="submit">Submit</button>
          <AdditionalRequirements
            additionalRequirements={values.additionalRequirements}
          />
        </>
      )}
    />
  )
)
