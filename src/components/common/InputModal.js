import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'semantic-ui-react'
import { Input } from 'formik-semantic-ui'
import { Formik } from 'formik'

const InputModal = ({ open = false, onSubmit, onClose, title = 'Modal' }) => {
  return (
    <Modal
      dimmer="blurring"
      size="mini"
      open={open}
      onClose={onClose}
      closeIcon>
      <div className="input-modal">
        <div className="input-modal__title">{title}</div>
        <Formik
          initialValues={{ input: '' }}
          onSubmit={({ input }) => onSubmit(input)}
          render={({ resetForm, submitForm }) => (
            <form
              onSubmit={e => {
                e.preventDefault()
                e.stopPropagation()
                submitForm()
              }}>
              <Input name="input" autoFocus />
              <div className="input-modal__btns">
                <Button
                  inverted
                  fluid
                  onClick={() => {
                    resetForm()
                    onClose()
                  }}
                  type="button">
                  <Icon name="remove" />
                  Cancel
                </Button>
                <div>
                  <Button type="submit" fluid>
                    <Icon name="checkmark" />
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          )}
        />
      </div>
    </Modal>
  )
}

InputModal.propTypes = {
  open: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string
}

export default InputModal
