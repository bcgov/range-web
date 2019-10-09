import React from 'react'
import { storiesOf } from '@storybook/react'
import { Form } from 'formik-semantic-ui'

import PlantCommunityActionsBox from './PlantCommunityActionsBox'

const plantCommunityActions = [
  {
    actionTypeId: 2,
    details: ''
  },
  {
    actionTypeId: 5,
    details: '',
    noGrazeStartMonth: 4,
    noGrazeStartDay: 15,
    noGrazeEndMonth: 8,
    noGrazeEndDay: 21
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
