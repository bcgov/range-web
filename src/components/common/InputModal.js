import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'semantic-ui-react'
import { Input } from 'formik-semantic-ui'
import { Formik } from 'formik'

const InputModal = ({
  open = false,
  onSubmit,
  onClose,
  title = 'Enter a value'
}) => {
  return (
    <Formik
      initialValues={{ input: '' }}
      onSubmit={({ input }) => onSubmit(input)}
      render={({ resetForm, handleSubmit }) => (
        <Modal
          dimmer="blurring"
          size="mini"
          open={open}
          onClose={onClose}
          closeIcon>
          <Modal.Header>{title}</Modal.Header>

          <Modal.Content>
            <form onSubmit={handleSubmit}>
              <Input name="input" autoFocus inputProps={{ fluid: true }} />
            </form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={() => {
                resetForm()
                onClose()
              }}
              type="button">
              <Icon name="remove" />
              Cancel
            </Button>
            <Button type="submit" primary onClick={handleSubmit}>
              <Icon name="checkmark" />
              Submit
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    />
  )
}

InputModal.propTypes = {
  open: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string
}

export default InputModal
