import React from 'react'
import PropTypes from 'prop-types'
import { Element } from 'react-scroll'
import Pastures from './pastures'
import { ELEMENT_ID } from '../../constants/variables'
import BasicInformation from './basicInformation'
import GrazingSchedules from './grazingSchedules'
import Usage from './usage'
import InvasivePlantChecklist from './invasivePlantChecklist'
import ManagementConsiderations from './managementConsiderations'
import MinisterIssues from './ministerIssuesRefactor'

const PlanForm = ({ plan }) => {
  return (
    <>
      <Element name={ELEMENT_ID.BASIC_INFORMATION}>
        <BasicInformation plan={plan} agreement={plan.agreement} />
      </Element>
      <Element name={ELEMENT_ID.PASTURES}>
        <Pastures pastures={plan.pastures} elementId={ELEMENT_ID.PASTURES} />
      </Element>

      <Usage plan={plan} usage={plan.agreement.usage} />

      <Element name={ELEMENT_ID.GRAZING_SCHEDULE}>
        <GrazingSchedules plan={plan} />
      </Element>
      <Element name={ELEMENT_ID.MINISTER_ISSUES}>
        <MinisterIssues issues={plan.ministerIssues} />
      </Element>
      <Element name={ELEMENT_ID.INVASIVE_PLANT_CHECKLIST}>
        <InvasivePlantChecklist
          namespace="invasivePlantChecklist"
          invasivePlantChecklist={plan.invasivePlantChecklist}
        />
      </Element>
      <Element name={ELEMENT_ID.MANAGEMENT_CONSIDERATIONS}>
        <ManagementConsiderations
          managementConsiderations={plan.managementConsiderations}
        />
      </Element>
    </>
  )
}

PlanForm.propTypes = {
  plan: PropTypes.shape({
    pastures: PropTypes.array.isRequired
  })
}

export default PlanForm
