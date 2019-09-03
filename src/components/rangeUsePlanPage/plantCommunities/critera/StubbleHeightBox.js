import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IndicatorPlantsForm from '../IndicatorPlantsForm'

const StubbleHeightBox = ({ indicatorPlants = [] }) => {
  const handleSubmit = () => {
    console.log('submit')
  }

  const handleChange = () => {
    console.log('change')
  }

  return (
    <div className="rup__plant-community__sh">
      <div className="rup__plant-community__sh__title">
        {/* <img src={IMAGE_SRC.INFO_ICON} alt="info icon" /> */}
        Stubble Height
      </div>

      <IndicatorPlantsForm
        indicatorPlants={indicatorPlants}
        onSubmit={handleSubmit}
        valueLabel="Height After Grazing (cm)"
      />
    </div>
  )
}

StubbleHeightBox.propTypes = {
  indicatorPlants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      plantSpecies: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  )
}

const mapDispatchToProps = {}

export default connect(
  null,
  mapDispatchToProps
)(StubbleHeightBox)
