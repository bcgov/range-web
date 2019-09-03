import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IndicatorPlantsForm from '../IndicatorPlantsForm'
import { plantCommunityUpdated } from '../../../../actions'
import { PLANT_CRITERIA } from '../../../../constants/variables'

const StubbleHeightBox = ({ plantCommunity, plantCommunityUpdated }) => {
  const handleChange = ({ indicatorPlants }) => {
    plantCommunityUpdated({
      plantCommunity: {
        ...plantCommunity,
        indicatorPlants: indicatorPlants.map(ip => ({
          ...ip,
          criteria: PLANT_CRITERIA.STUBBLE_HEIGHT
        }))
      }
    })
  }

  return (
    <div className="rup__plant-community__sh">
      <div className="rup__plant-community__sh__title">
        {/* <img src={IMAGE_SRC.INFO_ICON} alt="info icon" /> */}
        Stubble Height
      </div>

      <IndicatorPlantsForm
        indicatorPlants={plantCommunity.indicatorPlants.filter(
          ip => ip.criteria === PLANT_CRITERIA.STUBBLE_HEIGHT
        )}
        onChange={handleChange}
        valueLabel="Height After Grazing (cm)"
        criteria={PLANT_CRITERIA.STUBBLE_HEIGHT}
      />
    </div>
  )
}

StubbleHeightBox.propTypes = {
  plantCommunity: PropTypes.shape({
    indicatorPlants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        plantSpeciesId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    )
  }),
  plantCommunityUpdated: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  plantCommunityUpdated
}

export default connect(
  null,
  mapDispatchToProps
)(StubbleHeightBox)
