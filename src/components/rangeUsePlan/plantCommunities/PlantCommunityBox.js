import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

class PlantCommunityBox extends Component {
  static propTypes = {
    plantCommunity: PropTypes.shape({}).isRequired,
  }

  render() {
    const { plantCommunity } = this.props;
    const {
      // notes,
      communityType,
    } = plantCommunity;
    const communityTypeName = communityType && communityType.name;

    // console.log(plantCommunity);

    return (
      <div className="rup__plant-communitiy__box">
        <span>Plant Community: {communityTypeName}</span>
        <Icon name="angle right" />
        {/* <div>
          {notes}
        </div> */}
      </div>
    );
  }
}

export default PlantCommunityBox;
