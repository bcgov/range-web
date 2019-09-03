import React from 'react'
import { storiesOf } from '@storybook/react'
import { Form } from 'formik-semantic-ui'
import { action } from '@storybook/addon-actions'

import MonitoringAreaBox from './MonitoringAreaBox'

const monitoringArea = {
  latitude: '',
  location: 'Location',
  longitude: '',
  name: 'My area',
  purposes: [],
  rangelandHealth: ''
}

storiesOf(
  'rangeUsePlanPage/plantCommunities/monitoringAreas/MonitoringAreaBox',
  module
).add('default', () => (
  <Form
    initialValues={{ monitoringArea }}
    render={({ values }) => (
      <MonitoringAreaBox
        namespace="monitoringArea"
        monitoringArea={values.monitoringArea}
        onRemove={action('remove')}
        onCopy={action('copy')}
      />
    )}
  />
))
