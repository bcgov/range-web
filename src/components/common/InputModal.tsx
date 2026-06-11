import React, { useRef, useEffect } from 'react';
import { Button, Icon, Modal, Form as SemanticForm } from 'semantic-ui-react';
import { Formik, Field } from 'formik';

// Cast to work around Semantic UI React type compatibility issues
const Form = SemanticForm as any;

interface InputModalProps {
  open?: boolean;
  onSubmit: (value: string) => void;
  onClose: () => void;
  title?: string;
  placeholder?: string;
}

const InputModal: React.FC<InputModalProps> = ({
  open = false,
  onSubmit,
  onClose,
  title = 'Enter a value',
  placeholder = 'Type a value here...',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <Formik
      initialValues={{ input: '' }}
      onSubmit={({ input }, { resetForm }) => {
        resetForm();
        onSubmit(input);
      }}
    >
      {({ resetForm, handleSubmit }) => (
        <Modal dimmer="blurring" size="mini" open={open} onClose={onClose} closeIcon>
          <Modal.Header>{title}</Modal.Header>

          <Modal.Content>
            <Form
              onSubmit={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
            >
              <Field name="input" placeholder={placeholder} innerRef={inputRef} />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={() => {
                resetForm();
                onClose();
              }}
              type="button"
            >
              <Icon name="remove" />
              Cancel
            </Button>
            <Button type="submit" primary onClick={() => handleSubmit()}>
              <Icon name="checkmark" />
              Submit
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Formik>
  );
};

export default InputModal;
