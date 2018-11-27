import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { handleNullValue, getRangeReadinessMonthAndDate } from '../../../utils';

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
    } = plantCommunity;
    const readinessMonthAndDate = getRangeReadinessMonthAndDate(month, day);

    return (
      <div className="rup__plant-community__rr">
        <div className="rup__plant-community__rr__title">Range Readiness</div>
        <div>
          If more than one readiness criteria is provided, all such criteria must be met before grazing may accur.
        </div>
        <div className="rup__plant-community__rr__label">
          Readiness Date
        </div>
        <div>{handleNullValue(readinessMonthAndDate)}</div>
        <div className="rup__plant-community__rr__label">
          Notes
        </div>
        <div>{handleNullValue(rangeReadinessNote)}</div>
      </div>
    );
  }
}

export default RangeReadinessBox;
