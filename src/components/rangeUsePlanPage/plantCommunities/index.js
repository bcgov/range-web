import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { getPlantCommunitiesMap } from '../../../reducers/rootReducer'
import PlantCommunityBox from './PlantCommunityBox'
import AddPlantCommunityButton from './AddPlantCommunityButton'
import { NOT_PROVIDED } from '../../../constants/strings'

class PlantCommunities extends Component {
  static propTypes = {
    pasture: PropTypes.shape({}).isRequired,
    plantCommunitiesMap: PropTypes.shape({}).isRequired,
    canEdit: PropTypes.bool.isRequired
  }

  state = {
    activePlantCommunityId: 0
  }

  onPlantCommunityClicked = communityTypeId => () => {
    this.setState(prevState => {
      const nextId =
        prevState.activePlantCommunityId === communityTypeId
          ? -1
          : communityTypeId
      return {
        activePlantCommunityId: nextId
      }
    })
  }

  renderPlantCommunity = plantCommunity => (
    <PlantCommunityBox
      key={plantCommunity.id}
      plantCommunity={plantCommunity}
      activePlantCommunityId={this.state.activePlantCommunityId}
      onPlantCommunityClicked={this.onPlantCommunityClicked}
    />
  )

  renderPlantCommunities = (plantCommunities = []) => {
    const isEmpty = plantCommunities.length === 0

    return isEmpty && !this.props.canEdit ? (
      <div className="rup__plant-communities__not-provided">{NOT_PROVIDED}</div>
    ) : (
      <ul
        className={classnames('collaspible-boxes', {
          'collaspible-boxes--empty': isEmpty
        })}>
        {plantCommunities.map(this.renderPlantCommunity)}
      </ul>
    )
  }

  render() {
    const { pasture, plantCommunitiesMap, canEdit } = this.props
    const { plantCommunities: pcIds } = pasture
    const plantCommunities = pcIds.map(id => plantCommunitiesMap[id])

    return (
      <div className="rup__plant-communities">
        <div className="rup__plant-communities__title">Plant Communities</div>
        {canEdit && <AddPlantCommunityButton pasture={pasture} />}
        {this.renderPlantCommunities(plantCommunities)}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  plantCommunitiesMap: getPlantCommunitiesMap(state)
})

export default connect(
  mapStateToProps,
  null
)(PlantCommunities)
