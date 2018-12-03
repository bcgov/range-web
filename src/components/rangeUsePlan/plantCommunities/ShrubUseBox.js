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

    return (
      <div className="rup__plant-community__su">
        <div className="rup__plant-community__su__title">
          <img src={IMAGE_SRC.INFO_ICON} alt="info icon" />
          Shrub Use
        </div>
        <div>
          Unless otherwise indicated the allowable browse level is 25% of current annual growth.
        </div>
        <div className="rup__plant-community__i-plant__header">
          <div className="rup__plant-community__su__label">
            Indicator Plant
          </div>
          <div className="rup__plant-community__su__label">
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
