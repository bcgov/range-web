import React from 'react'
import { storiesOf } from '@storybook/react'
import { Form } from 'formik-semantic-ui'

import IndicatorPlantsForm from './IndicatorPlantsForm'

const indicatorPlants = [
  {
    id: 0,
    value: 15,
    plantSpeciesId: 2,
    criteria: 'stubbleHeight'
  },
  {
    id: 1,
    value: 2.5,
    plantSpeciesId: 2,
    criteria: 'rangeReadiness'
  },
  {
    id: 2,
    value: 2.5,
    plantSpeciesId: 81,
    criteria: 'rangeReadiness'
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
        <>
          <IndicatorPlantsForm
            indicatorPlants={values.plantCommunity.indicatorPlants}
            namespace="plantCommunity"
            valueLabel="Criteria (Leaf Stage)"
            valueType="leafStage"
            criteria="rangeReadiness"
          />
          <IndicatorPlantsForm
            indicatorPlants={values.plantCommunity.indicatorPlants}
            namespace="plantCommunity"
            valueLabel="Height After Grazing (cm)"
            valueType="stubbleHeight"
            criteria="stubbleHeight"
          />
        </>
      )}
    />
  )
)
