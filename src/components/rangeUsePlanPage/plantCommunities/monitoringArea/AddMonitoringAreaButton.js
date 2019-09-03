import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import InputModal from '../../../common/InputModal'

const AddMonitoringAreaButton = ({ onSubmit }) => {
  const [isModalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        primary
        type="button"
        className="icon labeled rup__plant-communities__add-button">
        <i className="add circle icon" />
        Add Monitoring Area
      </Button>
      <InputModal
        open={isModalOpen}
        onSubmit={input => {
          setModalOpen(false)
          onSubmit(input)
        }}
        onClose={() => setModalOpen(false)}
        title="Monitoring Area Name"
      />
    </>
  )
}

AddMonitoringAreaButton.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default AddMonitoringAreaButton
