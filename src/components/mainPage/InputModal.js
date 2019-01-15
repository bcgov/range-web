import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'semantic-ui-react';
import { getInputModal } from '../../reducers/rootReducer';
import { openInputModal, closeInputModal } from '../../actions';

class InputModal extends Component {
  static propTypes = {
    closeInputModal: PropTypes.func.isRequired,
    inputModal: PropTypes.shape({}),
  }

  static defaultProps = {
    inputModal: null,
  }

  handleModalClose = () => {
    this.props.closeInputModal();
  }

  render() {
    const { inputModal } = this.props;

    return (
      <Modal
        dimmer="blurring"
        size="mini"
        open={inputModal !== null}
        onClose={this.handleModalClose}
        closeIcon
      >
        <Button
          primary
          inverted
          onClick={this.handleModalClose}
        >
          Cancel
        </Button>
        <Button
          primary
          // style={{ marginLeft: '10px' }}
          // onClick={onYesBtnClicked}
        >
          Submit
        </Button>
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
