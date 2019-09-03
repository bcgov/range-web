import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { Button, Dropdown } from 'semantic-ui-react'
import InputModal from '../../common/InputModal'

const AddPlantCommunityButton = ({ onSubmit }) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const types = useReferences()[REFERENCE_KEY.PLANT_COMMUNITY_TYPE] || []
  const options = types.map(type => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id
  }))

  const otherType = types.find(t => t.name === 'Other')

  const onOptionClicked = (e, { value: communityTypeId }) => {
    if (otherType && communityTypeId === otherType.id) {
      return setModalOpen(true)
    }

    const plantCommunity = types.find(t => t.id === communityTypeId)

    onSubmit(plantCommunity)
  }

  return (
    <>
      <Dropdown
        trigger={
          <Button
            primary
            type="button"
            className="icon labeled rup__plant-communities__add-button">
            <i className="add circle icon" />
            Add Plant Community
          </Button>
        }
        options={options}
        icon={null}
        pointing="left"
        search
        onChange={onOptionClicked}
        selectOnBlur={false}
      />
      <InputModal
        open={isModalOpen}
        onSubmit={input => {
          setModalOpen(false)
          onSubmit({ ...otherType, name: input })
        }}
        onClose={() => setModalOpen(false)}
        title="Other Name"
      />
    </>
  )
}

AddPlantCommunityButton.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default AddPlantCommunityButton
