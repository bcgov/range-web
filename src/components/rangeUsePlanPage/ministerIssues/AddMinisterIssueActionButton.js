import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { Button, Dropdown } from 'semantic-ui-react'
import InputModal from '../../common/InputModal'

const AddMinisterIssueActionButton = ({ onSubmit }) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const types = useReferences()[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || []
  const options = types.map(type => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id
  }))

  const otherType = types.find(t => t.name === 'Other')

  const onOptionClicked = (e, { value: ministerIssueActionTypeId }) => {
    if (otherType && ministerIssueActionTypeId === otherType.id) {
      return setModalOpen(true)
    }

    const ministerIssueAction = types.find(
      t => t.id === ministerIssueActionTypeId
    )

    onSubmit(ministerIssueAction)
  }

  return (
    <>
      <Dropdown
        trigger={
          <Button primary type="button" className="icon labeled">
            <i className="add circle icon" />
            Add Action
          </Button>
        }
        options={options}
        icon={null}
        pointing="left"
        onChange={onOptionClicked}
        selectOnBlur={false}
      />
      <InputModal
        open={isModalOpen}
        onSubmit={input => {
          setModalOpen(false)
          onSubmit({ ...otherType, other: input })
        }}
        onClose={() => setModalOpen(false)}
        title="Other Name"
      />
    </>
  )
}

AddMinisterIssueActionButton.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default AddMinisterIssueActionButton
