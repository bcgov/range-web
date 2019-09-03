import React from 'react'
import { storiesOf } from '@storybook/react'
import { Form } from 'formik-semantic-ui'

import PlantCommunityActionsBox from './PlantCommunityActionsBox'

const plantCommunityActions = [
  {
    name: 'Herding',
    details: ''
  },
  {
    name: 'Timing',
    details: '',
    noGrazingStart: '',
    noGrazingEnd: ''
  }
]

storiesOf(
  'rangeUsePlanPage/plantCommunities/PlantCommunityActionsBox',
  module
).add('default', () => (
  <Form
    initialValues={{ plantCommunity: { plantCommunityActions } }}
    render={({ values }) => (
      <PlantCommunityActionsBox
        namespace="plantCommunity"
        actions={values.plantCommunity.plantCommunityActions}
      />
    )}
  />
))
