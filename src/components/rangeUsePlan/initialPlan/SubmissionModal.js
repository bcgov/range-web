/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'semantic-ui-react';
import { AMENDMENT_TYPE, REFERENCE_KEY, PLAN_STATUS, NUMBER_OF_LIMIT_FOR_NOTE } from '../../../constants/variables';
import { getReferences, getUser } from '../../../reducers/rootReducer';
import { updateRUP, createRUPStatusHistoryRecord } from '../../../actionCreators/planActionCreator';
import { planUpdated } from '../../../actions';
import { isSingleClient, isSubmittedAsMinor, isSubmittedAsMandatory, isMandatoryAmendment, isMinorAmendment, findStatusWithCode } from '../../../utils';
import TabsForSingleAH from './TabsForSingleAH';
import TabsForMultipleAH from './TabsForMultipleAH';

class SubmissionModal extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object),
    // updateRUP: PropTypes.func.isRequired,
    // updateStatusAndContent: PropTypes.func.isRequired,
    // createRUPStatusHistoryRecord: PropTypes.func.isRequired,
  }

  static defaultProps = {
    clients: [],
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    statusCode: null,
    isAgreed: false,
    note: '',
  })

  onClose = () => {
    this.setState(this.getInitialState());
    this.props.onClose();
  }

  handleStatusCodeChange = (e, { value: statusCode }) => {
    this.setState({ statusCode });
  }

  handleAgreeCheckBoxChange = (e, { checked }) => {
    this.setState({ isAgreed: checked });
  }

  handleNoteChange = (e, { value: note }) => {
    if (note.length <= NUMBER_OF_LIMIT_FOR_NOTE) {
      this.setState({ note });
    }
  }

  onSubmitClicked = (e) => {
    console.log(e, 'onSubmitClicked');
  }

  render() {
    const {
      open,
      clients,
      user,
      plan,
      references,
    } = this.props;
    const { statusCode, isAgreed, note } = this.state;

    return (
      <Modal
        dimmer="blurring"
        size="tiny"
        open={open}
        onClose={this.onClose}
        closeIcon={<Icon name="close" color="black" />}
      >
        <Modal.Content>

          <TabsForSingleAH
            clients={clients}
            statusCode={statusCode}
            isAgreed={isAgreed}
            note={note}
            handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
            handleStatusCodeChange={this.handleStatusCodeChange}
            handleNoteChange={this.handleNoteChange}
            onSubmitClicked={this.onSubmitClicked}
            onClose={this.onClose}
          />

          <TabsForMultipleAH
            clients={clients}
            statusCode={statusCode}
            isAgreed={isAgreed}
            note={note}
            user={user}
            handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
            handleStatusCodeChange={this.handleStatusCodeChange}
            handleNoteChange={this.handleNoteChange}
            onSubmitClicked={this.onSubmitClicked}
            onClose={this.onClose}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => (
  {
    user: getUser(state),
    references: getReferences(state),
  }
);

export default connect(mapStateToProps, {
  updateRUP,
  planUpdated,
  createRUPStatusHistoryRecord,
})(SubmissionModal);
