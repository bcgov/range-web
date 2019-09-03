import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { List, Modal, Icon, Button } from 'semantic-ui-react'

const ListModal = ({
  open,
  onClose,
  options,
  onOptionClick,
  onSubmit,
  title = 'Select an option',
  multiselect = false,
  buttonText = 'Submit'
}) => {
  const [selected, setSelected] = useState([])

  return (
    <Modal
      dimmer="blurring"
      size="mini"
      open={open}
      onClose={onClose}
      closeIcon>
      <Modal.Header>{title}</Modal.Header>
      <List
        divided
        relaxed
        selection
        style={{ margin: 0, maxHeight: 300, overflowY: 'scroll' }}>
        {options.map(option => (
          <List.Item
            key={option.key}
            onClick={() => {
              if (multiselect) {
                if (selected.includes(option)) {
                  setSelected(selected.filter(s => s.value !== option.value))
                } else {
                  setSelected([...selected, option])
                }
              }

              if (onOptionClick) onOptionClick(option)
            }}
            style={{ padding: '1em' }}>
            {selected.includes(option) && (
              <List.Content floated="right">
                <Icon name="check circle" color="blue" />
              </List.Content>
            )}
            <List.Content>{option.text}</List.Content>
          </List.Item>
        ))}
      </List>
      {multiselect && (
        <Modal.Actions>
          <Button
            primary
            onClick={() => {
              onSubmit(selected)
              setSelected([])
            }}
            disabled={selected.length === 0}>
            {buttonText}
          </Button>
        </Modal.Actions>
      )}
    </Modal>
  )
}

ListModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  multiselect: PropTypes.bool,
  buttonText: PropTypes.string
}

export default ListModal
