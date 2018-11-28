import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NOT_PROVIDED } from '../../../constants/strings';
import { handleNullValue } from '../../../utils';

class IndicatorPlants extends Component {
  static propTypes = {
    indicatorPlants: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    criteria: PropTypes.string.isRequired,
  }

  renderIndicatorPlant = (indicatorPlant) => {
    const { id, plantSpecies, value } = indicatorPlant;
    const plantSpeciesName = plantSpecies && plantSpecies.name;

    return (
      <div key={id} className="rup__plant-community__i-plant__row">
        <div>{handleNullValue(plantSpeciesName)}</div>
        <div>{handleNullValue(value)}</div>
      </div>
    );
  }

  render() {
    const { indicatorPlants = [], criteria } = this.props;
    const filtered = indicatorPlants
      .filter(ip => ip.criteria === criteria);

    if (filtered.length === 0) {
      return (
        <div className="rup__plant-community__i-plants__not-provided">
          {NOT_PROVIDED}
        </div>
      );
    }

    return (
      <div className="rup__plant-community__i-plants">
        {filtered.map(this.renderIndicatorPlant)}
      </div>
    );
  }
}

export default IndicatorPlants;
