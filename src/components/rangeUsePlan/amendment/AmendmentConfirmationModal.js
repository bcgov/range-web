import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Modal, Icon, Form, Radio, Checkbox } from 'semantic-ui-react';
import { getUser, getReferences, getConfirmationsMap } from '../../../reducers/rootReducer';
import { CONFIRMATION_OPTION, REFERENCE_KEY } from '../../../constants/variables';
import { getPlanTypeDescription, getUserFullName, getUserEmail, isClientTheUser, findConfirmationWithClientId, formatDateFromServer } from '../../../utils';
// import { updateRUP } from '../../../actionCreators/planActionCreator';
// import { planUpdated } from '../../../actions';

/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */

class AmendmentConfirmationModal extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object),
    references: PropTypes.shape({}).isRequired,
    confirmationsMap: PropTypes.shape({}).isRequired,
    // updateRUP: PropTypes.func.isRequired,
    // planUpdated: PropTypes.func.isRequired,
  };

  static defaultProps = {
    clients: [],
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => (
    {
      activeTab: 0,
      isAgreed: false,
      readyToGoNext: false,
      isConfirmating: false,
      confirmationOption: null,
    }
  )

  onClose = () => {
    this.setState(this.getInitialState());
    this.props.onClose();
  }

  onNextClicked = () => {
    this.setState(prevState => ({
      activeTab: prevState.activeTab + 1,
    }));
  }

  onBackClicked = () => {
    this.setState(prevState => ({
      readyToGoNext: true,
      activeTab: prevState.activeTab - 1,
    }));
  }

  onConfirmChoiceClicked = () => {
    if (this.state.confirmationOption === CONFIRMATION_OPTION.CONFIRM) {
      // make a network call
    }
    this.onNextClicked();
  }

  handleSubmissionChoiceChange = (e, { value: confirmationOption }) => {
    if (confirmationOption === CONFIRMATION_OPTION.REQUEST) {
      return this.setState({ confirmationOption, readyToGoNext: true, isAgreed: false });
    }
    return this.setState({ confirmationOption, readyToGoNext: false });
  }

  handleAgreeCheckBoxChange = (e, { checked }) => {
    this.setState({ isAgreed: checked, readyToGoNext: true });
  }

  renderAgreementHolders = (clients) => {
    const confirmedList = [
      <div key="confirmed1" className="amendment__confirmation__paragraph-title">
        Agreement holders who have confirmed the submission
      </div>,
      <div key="confirmed2" className="amendment__confirmation__ah-list__columns">
        <span>Name</span>
        <span>Confirmation Date</span>
      </div>,
    ];
    const notConfirmedList = [
      <div key="notConfirmed1" className="amendment__confirmation__paragraph-title">
        Agreement holders who have not yet confirmed the submission
      </div>,
    ];

    const { user, confirmationsMap, plan } = this.props;
    clients.map((client) => {
      const confirmation = findConfirmationWithClientId(client.id, plan.confirmations, confirmationsMap);
      const { confirmed, updatedAt } = confirmation || {};
      const confirmationDate = confirmed ? formatDateFromServer(updatedAt) : 'Awiting Confirmation';
      const view = (
        <div key={client.id} className="amendment__confirmation__ah-list">
          <div>
            <Icon name="user outline" />
            <span className={classnames('amendment__confirmation__ah-list__cname', {
              'amendment__confirmation__ah-list__cname--bold': isClientTheUser(client, user),
            })}
            >
              {client.name}
            </span>
          </div>
          <div>{confirmationDate}</div>
        </div>
      );
      if (confirmed) {
        return confirmedList.push(view);
      }
      return notConfirmedList.push(view);
    });

    return confirmedList.concat(notConfirmedList);
  }

  render() {
    const {
      activeTab,
      readyToGoNext,
      isAgreed,
      // isConfirmating,
      confirmationOption,
    } = this.state;
    const { open, user, plan, references, clients } = this.props;
    const index = activeTab + 1;
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const amendmentTypeDescription = getPlanTypeDescription(plan, amendmentTypes);
    const isConfirmBtnDisabled = confirmationOption === CONFIRMATION_OPTION.CONFIRM
      ? !(isAgreed && readyToGoNext) : !readyToGoNext;

    return (
      <Modal
        dimmer="blurring"
        size="tiny"
        open={open}
        onClose={this.onClose}
        closeIcon={<Icon name="close" color="black" />}
      >
        <Modal.Content>
          <Form>
            <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 0 })}>
              <div className="multi-form__tab__title">
                {`${index}. Confirm you Submission Choice`}
              </div>
              <Form.Field>
                <Radio
                  label={
                    <label>
                      <b>Confirm and send to Range staff for final decision: </b>
                      Short Description that informs the user about this option.
                    </label>
                  }
                  name="radioGroup"
                  value={CONFIRMATION_OPTION.CONFIRM}
                  checked={confirmationOption === CONFIRMATION_OPTION.CONFIRM}
                  onChange={this.handleSubmissionChoiceChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label={
                    <label>
                      <b>Request clarification or changes: </b>
                      Short Description that informs the user about this option.
                    </label>
                  }
                  name="radioGroup"
                  value={CONFIRMATION_OPTION.REQUEST}
                  checked={confirmationOption === CONFIRMATION_OPTION.REQUEST}
                  onChange={this.handleSubmissionChoiceChange}
                />
              </Form.Field>
              <div style={{ width: '100%' }}>
                {this.renderAgreementHolders(clients)}
              </div>
              <Form.Field>
                <Checkbox
                  label="I understand that this submission constitues a legal document and eSignature. This submission will be reviewed the Range Staff."
                  checked={isAgreed}
                  style={{ marginTop: '20px' }}
                  disabled={confirmationOption !== CONFIRMATION_OPTION.CONFIRM}
                  onChange={this.handleAgreeCheckBoxChange}
                />
              </Form.Field>
              <div className="multi-form__btns">
                <Button
                  className="multi-form__btn"
                  onClick={this.onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="multi-form__btn"
                  disabled={isConfirmBtnDisabled}
                  onClick={this.onConfirmChoiceClicked}
                >
                  Confirm Choice
                </Button>
              </div>
            </div>
          </Form>

          {confirmationOption === CONFIRMATION_OPTION.CONFIRM &&
            <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 1 })}>
              <div className="amendment__submission__last-tab">
                <Icon style={{ marginBottom: '10px' }} name="check circle outline" color="green" size="huge" />
                <div className="amendment__submission__last-tab__title">
                  Your {amendmentTypeDescription} confirmation has been saved
                </div>
                <div style={{ width: '100%' }}>
                  {this.renderAgreementHolders(clients)}
                </div>
                <Button style={{ marginTop: '15px' }} onClick={this.onClose}>Finish</Button>
              </div>
            </div>
          }

          {confirmationOption === CONFIRMATION_OPTION.REQUEST &&
            <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 1 })}>
              <div className="multi-form__tab__title">
                {`${index}. Request Clarification or Changes`}
              </div>
              <div className="amendment__confirmation__request__header">
                Your approval has not been submitted.
              </div>
              <div style={{ marginBottom: '20px' }}>
                Please contact {`${getUserFullName(plan.creator)}(${getUserEmail(user)})`} who initiated this plan amendment for clarification or to request changes.
              </div>
              <div style={{ marginBottom: '20px' }}>
                Submissions can only be recalled by {getUserFullName(plan.creator)} who initiated this amendment.
              </div>
              <div className="multi-form__btns">
                <Button
                  className="multi-form__btn"
                  onClick={this.onBackClicked}
                >
                  Back
                </Button>
                <Button
                  className="multi-form__btn"
                  onClick={this.onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          }
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => (
  {
    user: getUser(state),
    references: getReferences(state),
    confirmationsMap: getConfirmationsMap(state),
  }
);

export default connect(mapStateToProps, null)(AmendmentConfirmationModal);
