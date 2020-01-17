import React from 'react'
import PropTypes from 'prop-types'
import IndicatorPlantsForm from '../IndicatorPlantsForm'
import { PLANT_CRITERIA } from '../../../../constants/variables'

const StubbleHeightBox = ({ plantCommunity, planId, pastureId, namespace }) => {
  return (
    <div className="rup__plant-community__sh">
      <div className="rup__plant-community__sh__title">
        {/* <img src={IMAGE_SRC.INFO_ICON} alt="info icon" /> */}
        Stubble Height
      </div>

      <IndicatorPlantsForm
        indicatorPlants={plantCommunity.indicatorPlants}
        namespace={namespace}
        valueLabel="Height After Grazing (cm)"
        valueType="stubbleHeight"
        planId={planId}
        pastureId={pastureId}
        criteria={PLANT_CRITERIA.STUBBLE_HEIGHT}
        communityId={plantCommunity.id}
      />
    </div>
  )
}

StubbleHeightBox.propTypes = {
  plantCommunity: PropTypes.shape({
    indicatorPlants: PropTypes.arrayOf(PropTypes.object)
  }),
  namespace: PropTypes.string.isRequired
}

export default StubbleHeightBox
