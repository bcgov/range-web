import React, { useState } from 'react';
import { List as SemanticList, Modal, Icon, Button } from 'semantic-ui-react';

// Cast to work around Semantic UI React type compatibility issues
const List = SemanticList as any;

interface ListOption {
  key: string | number;
  value: any;
  text: string;
  disabled?: boolean;
}

interface ListModalProps {
  open: boolean;
  onClose: () => void;
  options: ListOption[];
  onOptionClick?: (option: ListOption) => void;
  onSubmit?: (selected: ListOption[]) => void;
  title?: string;
  multiselect?: boolean;
  buttonText?: string;
}

function ListModal({
  open,
  onClose,
  options,
  onOptionClick,
  onSubmit,
  title = 'Select an option',
  multiselect = false,
  buttonText = 'Submit',
}: ListModalProps) {
  const [selected, setSelected] = useState<ListOption[]>([]);

  return (
    <Modal dimmer="blurring" size="mini" open={open} onClose={onClose} closeIcon>
      <Modal.Header>{title}</Modal.Header>
      <List divided relaxed selection style={{ margin: 0, maxHeight: 300, overflowY: 'scroll' }}>
        {options.map((option) => (
          <List.Item
            key={option.key}
            disabled={option.disabled}
            onClick={() => {
              if (multiselect) {
                if (selected.includes(option)) {
                  setSelected(selected.filter((s) => s.value !== option.value));
                } else {
                  setSelected([...selected, option]);
                }
              }

              if (onOptionClick) onOptionClick(option);
            }}
            style={{ padding: '1em' }}
          >
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
              onSubmit?.(selected);
              setSelected([]);
            }}
            disabled={selected.length === 0}
          >
            {buttonText}
          </Button>
        </Modal.Actions>
      )}
    </Modal>
  );
}

export default ListModal;
