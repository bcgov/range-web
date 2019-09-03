import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect, getIn } from 'formik'
import ListModal from '../../../common/ListModal'
import { Button } from 'semantic-ui-react'

const Import = ({ formik, onSubmit }) => {
  const [state, setState] = useState({
    pasture: null,
    showPastureModal: false,
    plantCommunity: null,
    showPlantCommunityModal: false,
    showCriteriaModal: false
  })

  const pastures = getIn(formik.values, 'pastures')
  const pasturesOptions = pastures.map(pasture => ({
    value: pasture.id,
    text: pasture.name,
    key: pasture.id,
    pasture
  }))

  let plantCommunityOptions = []
  if (state.pasture) {
    plantCommunityOptions = state.pasture.plantCommunities.map(pc => ({
      value: pc.id,
      text: pc.name,
      key: pc.id,
      plantCommunity: pc
    }))
  }

  return (
    <>
      <Button
        primary
        type="button"
        className="icon labeled rup__plant-communities__add-button"
        onClick={() =>
          setState({
            ...state,
            showPastureModal: true
          })
        }>
        <i className="add circle icon" />
        Import
      </Button>
      <ListModal
        options={pasturesOptions}
        open={state.showPastureModal}
        title="Choose Pasture"
        onClose={() =>
          setState({
            ...state,
            showPastureModal: false
          })
        }
        onOptionClick={({ pasture }) =>
          setState({
            ...state,
            pasture,
            showPastureModal: false,
            showPlantCommunityModal: true
          })
        }
      />
      <ListModal
        options={plantCommunityOptions}
        open={state.showPlantCommunityModal}
        title={
          state.pasture
            ? `Choose Plant Community from ${state.pasture.name}`
            : 'Choose Plant Community'
        }
        onClose={() =>
          setState({
            ...state,
            pasture: null,
            showPlantCommunityModal: false
          })
        }
        onOptionClick={({ plantCommunity }) => {
          setState({
            ...state,
            plantCommunity,
            showPlantCommunityModal: false,
            showCriteriaModal: true
          })
        }}
      />
      <ListModal
        multiselect
        open={state.showCriteriaModal}
        options={[
          {
            key: 'rangeReadiness',
            value: 'rangeReadiness',
            text: 'Range Readiness'
          },
          {
            key: 'stubbleHeight',
            value: 'stubbleHeight',
            text: 'Stubble Height'
          },
          {
            key: 'shrubUse',
            value: 'shrubUse',
            text: 'Shrub Use'
          }
        ]}
        onClose={() =>
          setState({
            ...state,
            pasture: null,
            plantCommunity: null
          })
        }
        onSubmit={criteria => {
          onSubmit({
            pasture: state.pasture,
            plantCommunity: state.plantCommunity,
            criteria: criteria.map(c => c.value)
          })
          setState({
            ...state,
            showCriteriaModal: false,
            pasture: null,
            plantCommunity: null
          })
        }}
      />
    </>
  )
}

Import.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      pastures: PropTypes.array.isRequired
    })
  }),
  onSubmit: PropTypes.func.isRequired
}

export default connect(Import)
