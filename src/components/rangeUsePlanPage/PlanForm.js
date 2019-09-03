import React from 'react'
import PropTypes from 'prop-types'
import Pastures from './pastures'
import { ELEMENT_ID } from '../../constants/variables'
import BasicInformation from './basicInformation'
import GrazingSchedules from './grazingSchedules'
import Usage from './usage'
import InvasivePlantChecklist from './invasivePlantChecklist'

const PlanForm = ({ plan }) => {
  return (
    <>
      <BasicInformation plan={plan} agreement={plan.agreement} />
      <Pastures pastures={plan.pastures} elementId={ELEMENT_ID.PASTURES} />
      <Usage plan={plan} usage={plan.agreement.usage} />
      <GrazingSchedules plan={plan} />
      <InvasivePlantChecklist
        namespace="invasivePlantChecklist"
        invasivePlantChecklist={plan.invasivePlantChecklist}
      />
    </>
  )
}

PlanForm.propTypes = {
  plan: PropTypes.shape({
    pastures: PropTypes.array.isRequired
  })
}

export default PlanForm
