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
    const stubbleHeight = 'rup__plant-community__sh';

    return (
      <div className={`${stubbleHeight}`}>
        <div className={`${stubbleHeight}__title`}>
          <img src={IMAGE_SRC.INFO_ICON} alt="info icon" />
          Stubble Height
        </div>
        <div>
          Livestock must be removed on the first to occur of the date in the plan (ex. schedule), stubble height criteria or average browse criteria.
        </div>
        <div className="rup__plant-community__i-plant__header">
          <div className={`${stubbleHeight}__label`}>
            Indicator Plant
          </div>
          <div className={`${stubbleHeight}__label`}>
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
