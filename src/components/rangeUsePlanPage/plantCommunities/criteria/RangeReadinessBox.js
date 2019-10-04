import React from 'react'
import PropTypes from 'prop-types'

import IndicatorPlantsForm from '../IndicatorPlantsForm'
import { PLANT_CRITERIA } from '../../../../constants/variables'
import { RANGE_READINESS } from '../../../../constants/fields'
import PermissionsField from '../../../common/PermissionsField'
import DateInputField from '../../../common/form/DateInputField'
import { TextArea } from 'formik-semantic-ui'

const RangeReadinessBox = ({ plantCommunity, namespace }) => {
  const { rangeReadinessDate, rangeReadinessNotes } = plantCommunity

  return (
    <div className="rup__plant-community__sh">
      <div className="rup__plant-community__rr__title">
        {/* <img src={IMAGE_SRC.INFO_ICON} alt="info icon" /> */}
        Range Readiness
      </div>
      <div>
        If more than one readiness criteria is provided, all such criteria must
        be met before grazing may occur.
      </div>
      <PermissionsField
        name={`${namespace}.rangeReadinessDate`}
        permission={RANGE_READINESS.DATE}
        component={DateInputField}
        displayValue={rangeReadinessDate}
        label="Readiness Date"
        dateFormat="MMMM DD"
      />
      <PermissionsField
        name={`${namespace}.rangeReadinessNotes`}
        permission={RANGE_READINESS.NOTES}
        component={TextArea}
        displayValue={rangeReadinessNotes}
        label="Notes"
        fast
      />
      <IndicatorPlantsForm
        indicatorPlants={plantCommunity.indicatorPlants}
        namespace={namespace}
        valueLabel="Criteria (Leaf Stage)"
        valueType="leafStage"
        criteria={PLANT_CRITERIA.RANGE_READINESS}
        fast
      />
    </div>
  )
}

RangeReadinessBox.propTypes = {
  plantCommunity: PropTypes.shape({
    indicatorPlants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        plantSpeciesId: PropTypes.number.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired
      })
    )
  }),
  namespace: PropTypes.string.isRequired
}

export default RangeReadinessBox
