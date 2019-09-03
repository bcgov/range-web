import React from 'react'
import PropTypes from 'prop-types'
import { NOT_PROVIDED } from '../../../constants/strings'
import { handleNullValue } from '../../../utils'

const IndicatorPlants = ({ indicatorPlants = [], criteria }) => {
  const filtered = indicatorPlants.filter(ip => ip.criteria === criteria)

  if (filtered.length === 0) {
    return (
      <div className="rup__plant-community__i-plants__not-provided">
        {NOT_PROVIDED}
      </div>
    )
  }

  return (
    <div className="rup__plant-community__i-plants">
      {filtered.map(plant => (
        <div key={plant.id} className="rup__plant-community__i-plant__row">
          <div>
            {handleNullValue(plant.plantSpecies && plant.plantSpecies.name)}
          </div>
          <div>{handleNullValue(plant.value)}</div>
        </div>
      ))}
    </div>
  )
}

IndicatorPlants.propTypes = {
  indicatorPlants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      plantSpecies: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  criteria: PropTypes.string.isRequired
}

export default IndicatorPlants
