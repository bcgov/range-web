import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import Pastures from './pastures'
import { Form } from 'formik-semantic-ui'
import { ELEMENT_ID } from '../../constants/variables'
import Effect from '../common/form/Effect'
import BasicInformation from './basicInformation'

const PlanForm = ({ plan }) => {
  const onChange = debounce(values => {
    console.log('form change', values)
  }, 1000)

  return (
    <Form
      initialValues={plan}
      validateOnChange={true}
      render={({ values: { pastures }, errors }) => (
        <>
          <Effect onChange={onChange} />
          <BasicInformation plan={plan} agreement={plan.agreement} />
          <Pastures pastures={pastures} elementId={ELEMENT_ID.PASTURES} />
        </>
      )}
    />
  )
}

PlanForm.propTypes = {
  plan: PropTypes.shape({
    pastures: PropTypes.array.isRequired
  })
}

export default PlanForm
