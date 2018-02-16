import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const propTypes = {
  rangeUsePlan: PropTypes.object.isRequired,
};

const defaultProps = {
  rangeUsePlan: {}
};

class RangeUsePlan extends Component {
  onViewClicked = (e) => {
    e.preventDefault();

  }

  render() {
    const { rangeUsePlan } = this.props;

    return (
      <li className="range-use-plan">
        <div className="range-use-plan__left">
          <div className="range-use-plan__number">
            {`RAN ${rangeUsePlan.number}`}
          </div>

          <div className="range-use-plan__divider" />
          <div className="range-use-plan__info">
            {rangeUsePlan.tenureHolder.name}
          </div>
        </div>

        <div className="range-use-plan__right">
          <Button 
            primary
            onClick={this.onViewClicked}
          >
            View
          </Button>
        </div>
      </li>
    );
  }
}

RangeUsePlan.propTypes = propTypes;
RangeUsePlan.defaultProps = defaultProps;
export default RangeUsePlan;