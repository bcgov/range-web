import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Modal, Icon, Form, Radio, Checkbox } from 'semantic-ui-react';
import { getUser, getReferences, getConfirmationsMap } from '../../../reducers/rootReducer';
import { CONFIRMATION_OPTION, REFERENCE_KEY } from '../../../constants/variables';
import { getPlanTypeDescription, getUserFullName, getUserEmail, findConfirmationWithClientId } from '../../../utils';
import { updateRUPConfirmation } from '../../../actionCreators/planActionCreator';
import { planUpdated, confirmationUpdated } from '../../../actions';
import ConfirmationList from './ConfirmationList';

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
    updateRUPConfirmation: PropTypes.func.isRequired,
    confirmationUpdated: PropTypes.func.isRequired,
    planUpdated: PropTypes.func.isRequired,
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
    const {
      updateRUPConfirmation, plan, confirmationsMap,
      user, confirmationUpdated, planUpdated, references,
    } = this.props;
    if (this.state.confirmationOption === CONFIRMATION_OPTION.CONFIRM) {
      const onRequest = () => this.setState({ isConfirmating: true });
      const onSuccess = (result) => {
        const { allConfirmed, plan: updatedPlan, confirmation } = result;
        const planStatuses = references[REFERENCE_KEY.PLAN_STATUS];
        const status = planStatuses.find(status => status.id === updatedPlan.statusId);

        if (allConfirmed) {
          planUpdated({ plan: { ...plan, ...updatedPlan, status } });
        }
        confirmationUpdated({ confirmation });
        this.setState({ isConfirmating: false });
        this.onNextClicked();
      };
      const onError = (err) => {
        this.setState({ isConfirmating: false });
        throw err;
      };
      const confirmation = findConfirmationWithClientId(user.clientId, plan.confirmations, confirmationsMap);

      onRequest();
      updateRUPConfirmation(plan, confirmation.id, true).then(
        (result) => {
          onSuccess(result);
        }, (err) => {
          onError(err);
        },
      );
    } else {
      this.onNextClicked();
    }
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

  render() {
    const {
      activeTab,
      readyToGoNext,
      isAgreed,
      isConfirmating,
      confirmationOption,
    } = this.state;
    const { open, user, plan, references, clients, confirmationsMap } = this.props;
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
              <ConfirmationList
                user={user}
                clients={clients}
                plan={plan}
                confirmationsMap={confirmationsMap}
              />
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
                  loading={isConfirmating}
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
                <ConfirmationList
                  user={user}
                  clients={clients}
                  plan={plan}
                  confirmationsMap={confirmationsMap}
                />
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

export default connect(mapStateToProps, {
  updateRUPConfirmation,
  planUpdated,
  confirmationUpdated,
})(AmendmentConfirmationModal);
