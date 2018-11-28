import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { handleNullValue, getRangeReadinessMonthAndDate } from '../../../utils';
import IndicatorPlants from './IndicatorPlants';
import { PLANT_CRITERIA } from '../../../constants/variables';

class RangeReadinessBox extends Component {
  static propTypes = {
    plantCommunity: PropTypes.shape({}).isRequired,
  }

  render() {
    const { plantCommunity } = this.props;
    const {
      rangeReadinessDay: day,
      rangeReadinessMonth: month,
      rangeReadinessNote,
      indicatorPlants,
    } = plantCommunity;
    const readinessMonthAndDate = getRangeReadinessMonthAndDate(month, day);
    const readiness = 'rup__plant-community__rr';

    return (
      <div className={`${readiness}`}>
        <div className={`${readiness}__title`}>Range Readiness</div>
        <div>
          If more than one readiness criteria is provided, all such criteria must be met before grazing may accur.
        </div>
        <div className={`${readiness}__label`}>
          Readiness Date
        </div>
        <div>{handleNullValue(readinessMonthAndDate)}</div>
        <div className={`${readiness}__label`}>
          Notes
        </div>
        <div>{handleNullValue(rangeReadinessNote)}</div>
        <div className="rup__plant-community__i-plant__header">
          <div className={`${readiness}__label`}>
            Indicator Plant
          </div>
          <div className={`${readiness}__label`}>
            Criteria (Leaf Stage)
          </div>
        </div>

        <IndicatorPlants
          indicatorPlants={indicatorPlants}
          criteria={PLANT_CRITERIA.RANGE_READINESS}
        />
      </div>
    );
  }
}

export default RangeReadinessBox;
