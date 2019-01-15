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
    const { closeInputModal, inputModal } = this.props;
    const onSubmit = inputModal && inputModal.onSubmit;

    onSubmit(this.state.input);
    closeInputModal();
  }

  handleModalClose = () => {
    this.props.closeInputModal();
  }

  render() {
    const { inputModal } = this.props;
    const { input } = this.state;
    const title = inputModal && inputModal.title;

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
                value={input}
                onChange={this.onInputChanged}
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
