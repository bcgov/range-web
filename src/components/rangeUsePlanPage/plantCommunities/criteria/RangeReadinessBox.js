import React from 'react'
import PropTypes from 'prop-types'

import IndicatorPlantsForm from '../IndicatorPlantsForm'
import { PLANT_CRITERIA } from '../../../../constants/variables'
import { RANGE_READINESS } from '../../../../constants/fields'
import { RANGE_READINESS_OTHER_TIP } from '../../../../constants/strings'
import PermissionsField from '../../../common/PermissionsField'
import DayMonthPicker from '../../../common/form/DayMonthPicker'
import { TextArea } from 'formik-semantic-ui'
import moment from 'moment'

const RangeReadinessBox = ({
  plantCommunity,
  planId,
  pastureId,
  namespace
}) => {
  const {
    rangeReadinessMonth,
    rangeReadinessDay,
    rangeReadinessNote
  } = plantCommunity

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
        monthName={`${namespace}.rangeReadinessMonth`}
        dayName={`${namespace}.rangeReadinessDay`}
        permission={RANGE_READINESS.DATE}
        component={DayMonthPicker}
        displayValue={moment(
          `${rangeReadinessMonth} ${rangeReadinessDay}`,
          'MM DD'
        ).format('MMMM DD')}
        label="Readiness Date"
        dateFormat="MMMM DD"
      />
      <PermissionsField
        name={`${namespace}.rangeReadinessNote`}
        permission={RANGE_READINESS.NOTE}
        tip={RANGE_READINESS_OTHER_TIP}
        component={TextArea}
        displayValue={rangeReadinessNote}
        label="Other"
        fast
      />
      <IndicatorPlantsForm
        indicatorPlants={plantCommunity.indicatorPlants}
        namespace={namespace}
        valueLabel="Criteria (Leaf Stage)"
        valueType="leafStage"
        criteria={PLANT_CRITERIA.RANGE_READINESS}
        planId={planId}
        pastureId={pastureId}
        communityId={plantCommunity.id}
        fast
      />
    </div>
  )
}

RangeReadinessBox.propTypes = {
  plantCommunity: PropTypes.shape({
    indicatorPlants: PropTypes.arrayOf(PropTypes.object)
  }),
  namespace: PropTypes.string.isRequired
}

export default RangeReadinessBox
