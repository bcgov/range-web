import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const propTypes = {
  rangeUsePlan: PropTypes.object.isRequired,
  onViewClicked: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
};

const defaultProps = {
  rangeUsePlan: {},
};

class RangeUsePlan extends Component {
  state = {
    isOpen: false
  }

  onViewClicked = (e) => {
    e.preventDefault();

    const { index, onViewClicked } = this.props;
    onViewClicked(index)
  }

  render() {
    const { rangeUsePlan, isActive } = this.props;

    return (
      <li className="range-use-plan">
        <div className="range-use-plan__content">
          <div className="range-use-plan__content__left">
            <div className="range-use-plan__content__number">
              {`RAN ${rangeUsePlan.number}`}
            </div>

            <div className="range-use-plan__content__divider" />
            <div className="range-use-plan__content__info">
              {rangeUsePlan.tenureHolder.name}
            </div>
          </div>

          <div className="range-use-plan__content__right">
            <Button 
              primary
              onClick={this.onViewClicked}
            >
              View
            </Button>
          </div>
        </div>

        <div 
          className={"range-use-plan__collapse" + (isActive ? " range-use-plan__collapse--active" : "")}
        >
          hello bottom!
        </div>
      </li>
    );
  }
}

RangeUsePlan.propTypes = propTypes;
RangeUsePlan.defaultProps = defaultProps;
export default RangeUsePlan;