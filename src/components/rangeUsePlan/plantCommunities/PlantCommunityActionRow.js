import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { handleNullValue } from '../../../utils';

class PlantCommunityActionRow extends Component {
  static propTypes = {
    plantCommunityAction: PropTypes.shape({}).isRequired,
  }

  render() {
    const actionClass = 'rup__plant-community__action';
    const { plantCommunityAction } = this.props;
    const { actionType, details } = plantCommunityAction;
    const actionTypeName = actionType && actionType.name;

    return (
      <div className={`${actionClass}__row`}>
        <div>
          {handleNullValue(actionTypeName)}
        </div>
        <div>
          {handleNullValue(details)}
        </div>
      </div>
    );
  }
}

export default PlantCommunityActionRow;
