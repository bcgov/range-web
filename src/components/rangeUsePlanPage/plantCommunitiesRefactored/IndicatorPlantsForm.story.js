import React from 'react'
import { storiesOf } from '@storybook/react'
import { Formik } from 'formik'
import { action } from '@storybook/addon-actions'

import IndicatorPlantsForm from './IndicatorPlantsForm'

const indicatorPlants = [
  {
    id: 0,
    value: 5.23,
    plantSpecies: 2
  }
]

const changeAction = action('change')

storiesOf('rangeUsePlanPage/plantCommunities/IndicatorPlantsForm', module).add(
  'default',
  () => (
    <IndicatorPlantsForm
      indicatorPlants={indicatorPlants}
      onChange={values => changeAction(values)}
      valueLabel="Height After Grazing (cm)"
    />
  )
)
