import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { Button, Dropdown } from 'semantic-ui-react'
import InputModal from '../../common/InputModal'

const AddMinisterIssueButton = ({ onSubmit }) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const types = useReferences()[REFERENCE_KEY.MINISTER_ISSUE_TYPE] || []
  const options = types.map(type => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id
  }))

  const otherType = types.find(t => t.name === 'Other')

  const onOptionClicked = (e, { value: ministerIssueTypeId }) => {
    if (otherType && ministerIssueTypeId === otherType.id) {
      return setModalOpen(true)
    }

    const ministerIssue = types.find(t => t.id === ministerIssueTypeId)

    onSubmit(ministerIssue)
  }

  return (
    <>
      <Dropdown
        trigger={
          <Button
            basic
            primary
            type="button"
            className="icon labeled rup__missues__add-button">
            <i className="add circle icon" />
            Add Minister Issue
          </Button>
        }
        options={options}
        icon={null}
        pointing="right"
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

AddMinisterIssueButton.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default AddMinisterIssueButton
