import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IndicatorPlants from './IndicatorPlants';
import { PLANT_CRITERIA, IMAGE_SRC } from '../../../constants/variables';

class ShrubUseBox extends Component {
  static propTypes = {
    plantCommunity: PropTypes.shape({}).isRequired,
  }

  render() {
    const { plantCommunity } = this.props;
    const { indicatorPlants } = plantCommunity;
    const shrubUse = 'rup__plant-community__su';

    return (
      <div className={`${shrubUse}`}>
        <div className={`${shrubUse}__title`}>
          <img src={IMAGE_SRC.INFO_ICON} alt="info icon" />
          Shrub Use
        </div>
        <div>
          Livestock must be removed from the pasture on the first to occur of the date in the plan (ex. schedule), stubble height criteria for any plant community in the pasture or average browse criteria.
        </div>
        <div className="rup__plant-community__i-plant__header">
          <div className={`${shrubUse}__label`}>
            Indicator Plant
          </div>
          <div className={`${shrubUse}__label`}>
            % of Current Annual Growth
          </div>
        </div>

        <IndicatorPlants
          indicatorPlants={indicatorPlants}
          criteria={PLANT_CRITERIA.SHRUBUSE}
        />
      </div>
    );
  }
}

export default ShrubUseBox;
