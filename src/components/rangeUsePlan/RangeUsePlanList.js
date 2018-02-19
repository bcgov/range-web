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
  state = {
    activeIndex: -1,
  }
  
  handleActiveRow = (index) => {
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index;
    
    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { rangeUsePlans } = this.props; 
    const { activeIndex } = this.state;

    return (
      <div className="range-use-plan-list">
        {rangeUsePlans.map((rangeUsePlan, index) => {
          return (
            <RangeUsePlan 
              key={index}
              index={index}
              isActive={activeIndex === index}
              rangeUsePlan={rangeUsePlan}
              onViewClicked={this.handleActiveRow}
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