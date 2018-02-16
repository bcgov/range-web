import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RangeUsePlan from './RangeUsePlan';

const propTypes = {
  rangeUsePlans: PropTypes.array.isRequired,
}

const defaultProps = {
  rangeUsePlans: []
}

class RangeUsePlanList extends Component {
  render() {
    const { rangeUsePlans } = this.props; 

    return (
      <div className="range-use-plan__list">
        {rangeUsePlans.map((rangeUsePlan, index) => {
          return (
            <RangeUsePlan 
              key={index}
              rangeUsePlan={rangeUsePlan}
            />
          );
        })}
      </div>
    );
  }
}

RangeUsePlanList.propTypes = propTypes;
RangeUsePlanList.defaultProps = defaultProps;
export default RangeUsePlanList;