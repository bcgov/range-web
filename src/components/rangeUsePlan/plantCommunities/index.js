import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPlantCommunitiesMap } from '../../../reducers/rootReducer';
import PlantCommunityBoxModal from './PlantCommunityBoxModal';
import { NOT_PROVIDED } from '../../../constants/strings';

class PlantCommunities extends Component {
  static propTypes = {
    pasture: PropTypes.shape({}).isRequired,
    plantCommunitiesMap: PropTypes.shape({}).isRequired,
  }

  renderPlantCommunity = (plantCommunity) => {
    const { pasture } = this.props;

    return (
      <PlantCommunityBoxModal
        key={plantCommunity.id}
        plantCommunity={plantCommunity}
        pasture={pasture}
      />
    );
  }

  renderPlantCommunities = (plantCommunities = []) => {
    const isEmpty = plantCommunities.length === 0;

    return isEmpty ? (
      <div className="rup__plant-communities__not-provided">{NOT_PROVIDED}</div>
    ) : (
      plantCommunities.map(this.renderPlantCommunity)
    );
  }

  render() {
    const { pasture, plantCommunitiesMap } = this.props;
    const { plantCommunities: pcIds } = pasture;
    const plantCommunities = pcIds.map(id => plantCommunitiesMap[id]);

    return (
      <div className="rup__plant-communities">
        <div className="rup__plant-communities__title">
          Plant Communities
        </div>

        {this.renderPlantCommunities(plantCommunities)}
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    plantCommunitiesMap: getPlantCommunitiesMap(state),
  }
);

export default connect(mapStateToProps, null)(PlantCommunities);
