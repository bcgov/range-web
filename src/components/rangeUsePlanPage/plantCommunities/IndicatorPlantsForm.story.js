import React from 'react'
import { storiesOf } from '@storybook/react'
import { Form } from 'formik-semantic-ui'

import IndicatorPlantsForm from './IndicatorPlantsForm'

const indicatorPlants = [
  {
    id: 0,
    value: 5.23,
    plantSpecies: 2
  }
]

storiesOf('rangeUsePlanPage/plantCommunities/IndicatorPlantsForm', module).add(
  'default',
  () => (
    <Form
      initialValues={{
        plantCommunity: {
          indicatorPlants
        }
      }}
      render={({ values }) => (
        <IndicatorPlantsForm
          indicatorPlants={values.plantCommunity.indicatorPlants}
          namespace="plantCommunity"
          valueLabel="Height After Grazing (cm)"
        />
      )}
    />
  )
)
