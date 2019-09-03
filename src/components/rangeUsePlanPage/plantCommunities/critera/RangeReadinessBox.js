import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  handleNullValue,
  getRangeReadinessMonthAndDate
} from '../../../../utils'
import IndicatorPlantsForm from '../IndicatorPlantsForm'
import { PLANT_CRITERIA } from '../../../../constants/variables'

class RangeReadinessBox extends Component {
  static propTypes = {
    plantCommunity: PropTypes.shape({}).isRequired
  }

  render() {
    const { plantCommunity } = this.props
    const {
      rangeReadinessDay: day,
      rangeReadinessMonth: month,
      rangeReadinessNote,
      indicatorPlants
    } = plantCommunity
    const readinessMonthAndDate = getRangeReadinessMonthAndDate(month, day)

    return (
      <div className="rup__plant-community__rr">
        <div className="rup__plant-community__rr__title">
          {/* <img src={IMAGE_SRC.INFO_ICON} alt="info icon" /> */}
          Range Readiness
        </div>
        <div>
          If more than one readiness criteria is provided, all such criteria
          must be met before grazing may occur.
        </div>

        <div className="rup__plant-community__rr__label">Readiness Date</div>
        <div>{handleNullValue(readinessMonthAndDate)}</div>

        <IndicatorPlantsForm
          indicatorPlants={indicatorPlants}
          valueLabel="Criteria (Leaf Stage)"
        />

        <div className="rup__plant-community__rr__label">Notes</div>
        <div>{handleNullValue(rangeReadinessNote)}</div>
      </div>
    )
  }
}

export default RangeReadinessBox
