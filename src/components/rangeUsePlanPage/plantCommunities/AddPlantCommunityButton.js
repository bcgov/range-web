import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Dropdown, Button } from 'semantic-ui-react'
import { getReferences } from '../../../reducers/rootReducer'
import {
  plantCommunityAdded,
  pastureUpdated,
  openInputModal
} from '../../../actions'
import { REFERENCE_KEY } from '../../../constants/variables'

class AddPlantCommunityButton extends Component {
  static propTypes = {
    pasture: PropTypes.shape({
      id: PropTypes.number.isRequired,
      plantCommunities: PropTypes.array.isRequired
    }).isRequired,
    references: PropTypes.shape({}).isRequired,
    plantCommunityAdded: PropTypes.func.isRequired,
    pastureUpdated: PropTypes.func.isRequired,
    openInputModal: PropTypes.func.isRequired
  }

  onSubmit = plantCommunity => {
    // Set temporary ID based on timestamp to track unsubmitted plant
    // communities
    const id = new Date().toISOString()

    // Add an object to the plantCommunities array
    this.props.plantCommunityAdded({
      id,
      pastureId: this.props.pasture.id,
      communityTypeId: plantCommunity.id,
      name: plantCommunity.name
    })

    // Add id to the pastures.plantCommunities array
    this.props.pastureUpdated({
      pasture: {
        ...this.props.pasture,
        plantCommunities: [...this.props.pasture.plantCommunities, id]
      }
    })
  }

  onOptionClicked = (e, { value: communityTypeId }) => {
    const { openInputModal, references } = this.props
    const communityTypes = references[REFERENCE_KEY.PLANT_COMMUNITY_TYPE] || []
    const otherType = communityTypes.find(t => t.name === 'Other')

    // open a modal when the option 'other' is selected
    if (otherType && communityTypeId === otherType.id) {
      return openInputModal({
        id: 'plant_community_action_other',
        title: 'Other Name',
        onSubmit: name => this.onSubmit({ ...otherType, name })
      })
    }

    const plantCommunity = communityTypes.find(t => t.id === communityTypeId)
    this.onSubmit(plantCommunity)
  }

  render() {
    const types =
      this.props.references[REFERENCE_KEY.PLANT_COMMUNITY_TYPE] || []
    const options = types.map(type => ({
      key: type.id,
      value: type.id,
      text: type.name
    }))

    return (
      <Dropdown
        trigger={
          <Button
            primary
            className="icon labeled rup__plant-communities__add-button">
            <i className="add circle icon" />
            Add Plant Community
          </Button>
        }
        options={options}
        icon={null}
        pointing="left"
        search
        onChange={this.onOptionClicked}
        selectOnBlur={false}
      />
    )
  }
}

const mapStateToProps = state => ({
  references: getReferences(state)
})

export default connect(
  mapStateToProps,
  {
    plantCommunityAdded,
    pastureUpdated,
    openInputModal
  }
)(AddPlantCommunityButton)
