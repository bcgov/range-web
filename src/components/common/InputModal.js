import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'semantic-ui-react'
import { Form } from 'semantic-ui-react'
import { Formik, Field } from 'formik'

const InputModal = ({
  open = false,
  onSubmit,
  onClose,
  title = 'Enter a value',
  placeholder = 'Type a value here...'
}) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      inputRef.current.focus()
    }
  }, [open])

  return (
    <Formik
      initialValues={{ input: '' }}
      onSubmit={({ input }, { resetForm }) => {
        resetForm()
        onSubmit(input)
      }}
      render={({ resetForm, handleSubmit }) => (
        <Modal
          dimmer="blurring"
          size="mini"
          open={open}
          onClose={onClose}
          closeIcon>
          <Modal.Header>{title}</Modal.Header>

          <Modal.Content>
            <Form
              onSubmit={e => {
                e.preventDefault()
                e.stopPropagation()
                handleSubmit()
              }}>
              <Field
                name="input"
                placeholder={placeholder}
                innerRef={inputRef}
              />
            </Form>
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
  title: PropTypes.string,
  placeholder: PropTypes.string
}

export default InputModal
