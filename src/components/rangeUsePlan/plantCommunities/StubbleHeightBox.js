import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IndicatorPlants from './IndicatorPlants';
import { PLANT_CRITERIA, IMAGE_SRC } from '../../../constants/variables';

class StubbleHeightBox extends Component {
  static propTypes = {
    plantCommunity: PropTypes.shape({}).isRequired,
  }

  render() {
    const { plantCommunity } = this.props;
    const { indicatorPlants } = plantCommunity;

    return (
      <div className="rup__plant-community__sh">
        <div className="rup__plant-community__sh__title">
          <img src={IMAGE_SRC.INFO_ICON} alt="info icon" />
          Stubble Height
        </div>
        <div className="rup__plant-community__i-plant__header">
          <div className="rup__plant-community__sh__label">
            Indicator Plant
          </div>
          <div className="rup__plant-community__sh__label">
            Height After Grazing (cm)
          </div>
        </div>

        <IndicatorPlants
          indicatorPlants={indicatorPlants}
          criteria={PLANT_CRITERIA.STUBBLE_HEIGHT}
        />
      </div>
    );
  }
}

export default StubbleHeightBox;
