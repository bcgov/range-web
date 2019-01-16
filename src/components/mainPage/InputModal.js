import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'semantic-ui-react';
import { getInputModal } from '../../reducers/rootReducer';
import { openInputModal, closeInputModal } from '../../actions';
import { InvertedButton } from '../common';

class InputModal extends Component {
  static propTypes = {
    closeInputModal: PropTypes.func.isRequired,
    inputModal: PropTypes.shape({
      title: PropTypes.string,
      onSubmit: PropTypes.func,
    }),
  }

  static defaultProps = {
    inputModal: null,
  }

  state = {
    input: '',
  }

  onInputChanged = (e) => {
    this.setState({
      input: e.target.value,
    });
  }

  onSubmitClicked = () => {
    const { inputModal } = this.props;
    const onSubmit = inputModal && inputModal.onSubmit;

    if (onSubmit) {
      onSubmit(this.state.input);
    }
    this.handleModalClose();
  }

  onInputKeyPressed = (e) => {
    if (e.charCode === 13) {
      this.onSubmitClicked();
    }
  }

  handleModalClose = () => {
    this.setState({ input: '' });
    this.props.closeInputModal();
  }

  render() {
    const { inputModal } = this.props;
    const { input } = this.state;
    const title = inputModal && inputModal.title;

    /* eslint-disable jsx-a11y/no-autofocus */
    return (
      <Modal
        dimmer="blurring"
        size="mini"
        open={inputModal !== null}
        onClose={this.handleModalClose}
        closeIcon
      >
        <div className="input-modal">
          <div className="input-modal__title">
            {title}
          </div>
          <Form>
            <Form.Field>
              <input
                type="text"
                autoFocus
                value={input}
                onChange={this.onInputChanged}
                onKeyPress={this.onInputKeyPressed}
              />
            </Form.Field>
          </Form>
          <div className="input-modal__btns">
            <InvertedButton
              primaryColor
              fluid
              onClick={this.handleModalClose}
            >
              Cancel
            </InvertedButton>
            <div>
              <Button
                primary
                fluid
                onClick={this.onSubmitClicked}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  inputModal: getInputModal(state),
});
export default connect(mapStateToProps, {
  openInputModal,
  closeInputModal,
})(InputModal);
