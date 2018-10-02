import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Modal, Icon, Form, Radio } from 'semantic-ui-react';
import { AMENDMENT_TYPE, REFERENCE_KEY, PLAN_STATUS } from '../../../constants/variables';
import { getReferences, getUser } from '../../../reducers/rootReducer';
import { updateRUP } from '../../../actionCreators/planActionCreator';
import { planUpdated } from '../../../actions';
import MinorTabsForSingle from './MinorTabsForSingle';
import MinorTabsForMultiple from './MinorTabsForMultiple';
import MandatoryTabsForSingle from './MandatoryTabsForSingle';
import { isSingleClient, isSubmittedAsMinor, isSubmittedAsMandatory, isMandatoryAmendment, isMinorAmendment } from '../../../utils';
import MandatoryTabsForMultiple from './MandatoryTabsForMultiple';

/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */

class AmendmentSubmissionModal extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object),
    updateRUP: PropTypes.func.isRequired,
    updateStatusAndContent: PropTypes.func.isRequired,
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
      amendmentTypeCode: null,
      mandatoryStatusCode: null,
      isAgreed: false,
      readyToGoNext: false,
      isSubmitting: false,
    }
  )

  onClose = () => {
    this.setState(this.getInitialState());
    this.props.onClose();
  }

  onNextClicked = () => {
    this.setState(prevState => ({
      activeTab: prevState.activeTab + 1,
      readyToGoNext: false,
    }));
  }

  onBackClicked = () => {
    this.setState(prevState => ({
      readyToGoNext: true,
      activeTab: prevState.activeTab - 1,
    }));
  }

  handleAmendmentTypeChange = (e, { value: amendmentTypeCode }) => {
    this.setState({ amendmentTypeCode, readyToGoNext: true });
  }

  handleAgreeCheckBoxChange = (e, { checked }) => {
    this.setState({ isAgreed: checked, readyToGoNext: true });
  }

  handleMandatoryStatusCodeChange = (e, { value: mandatoryStatusCode }) => {
    this.setState({ mandatoryStatusCode, readyToGoNext: true });
  }

  onSubmitClicked = () => {
    const { plan, references, clients } = this.props;
    const { mandatoryStatusCode, amendmentTypeCode } = this.state;
    const { amendmentTypeId } = plan;
    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS];
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const minor = amendmentTypes.find(at => at.code === AMENDMENT_TYPE.MINOR);
    const mandatory = amendmentTypes.find(at => at.code === AMENDMENT_TYPE.MANDATORY);
    const confirmationAwaiting = planStatuses.find(s => s.code === PLAN_STATUS.AWAITING_CONFIRMATION);
    const mandatoryStatus = planStatuses.find(s => s.code === mandatoryStatusCode);
    const isMinor = isMinorAmendment(amendmentTypeId, amendmentTypes, amendmentTypeCode);
    const isMandatory = isMandatoryAmendment(amendmentTypeId, amendmentTypes, amendmentTypeCode);

    if (isMinor && isSingleClient(clients)) {
      const stands = planStatuses.find(s => s.code === PLAN_STATUS.STANDS);
      this.submitAmendment(plan, stands, minor);
      return;
    }

    if (isMinor && !isSingleClient(clients)) {
      this.submitAmendment(plan, confirmationAwaiting, minor);
      return;
    }

    if (isMandatory && isSingleClient(clients)) {
      this.submitAmendment(plan, mandatoryStatus, mandatory);
      return;
    }

    if (isMandatory && !isSingleClient(clients)) {
      if (mandatoryStatusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION) {
        this.submitAmendment(plan, confirmationAwaiting, mandatory);
        return;
      }
      this.submitAmendment(plan, mandatoryStatus, mandatory);
    }
  }

  submitAmendment = (plan, planStatus, amendmentType) => {
    const {
      updateRUP,
      updateStatusAndContent,
    } = this.props;

    const onRequest = () => {
      this.setState({ isSubmitting: true });
    };
    const onSuccess = () => {
      // update amendment type of the plan
      updateRUP(plan.id, {
        amendmentTypeId: amendmentType.id,
      }).then(() => {
        this.onNextClicked();
        this.setState({ isSubmitting: false });
      });
    };
    const onError = () => {
      this.onClose();
    };

    updateStatusAndContent(planStatus, onRequest, onSuccess, onError);
  }

  render() {
    const {
      activeTab, readyToGoNext, isAgreed,
      isSubmitting, mandatoryStatusCode, amendmentTypeCode,
    } = this.state;
    const { open, clients, user, plan, references } = this.props;
    const { amendmentTypeId } = plan;
    const index = activeTab + 1;
    const isThereSingleAH = isSingleClient(clients);
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const isSubmittedAsMinorAmendment = isSubmittedAsMinor(amendmentTypeId, amendmentTypes);
    const isSubmittedAsMandatoryAmendment = isSubmittedAsMandatory(amendmentTypeId, amendmentTypes);
    const isAmendmentTypeDecided = isSubmittedAsMinorAmendment || isSubmittedAsMandatoryAmendment;
    const isMinor = isMinorAmendment(amendmentTypeId, amendmentTypes, amendmentTypeCode);
    const isMandatory = isMandatoryAmendment(amendmentTypeId, amendmentTypes, amendmentTypeCode);

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
                {`${index}. Ready to Submit? Choose Your Amendment Type`}
              </div>
              <Form.Field className="amendment__submission__radio-field">
                <Radio
                  className="amendment__submission__radio"
                  label={
                    <label>
                      <b>Minor Amendment: </b>
                      Otherwise conforms to this Act, the regulations and the standards, and does not materially affect the likelihood of achieving the intended results specified in the plan.
                    </label>
                  }
                  name="radioGroup"
                  value={AMENDMENT_TYPE.MINOR}
                  checked={isMinor}
                  onChange={this.handleAmendmentTypeChange}
                  disabled={isAmendmentTypeDecided}
                />
              </Form.Field>
              <Form.Field className="amendment__submission__radio-field">
                <Radio
                  className="amendment__submission__radio"
                  label={
                    <label>
                      <b>Mandatory Amendment: </b>
                      Does not meet the minor amendment criteria, or has been required by the decision makers.
                    </label>
                  }
                  name="radioGroup"
                  value={AMENDMENT_TYPE.MANDATORY}
                  checked={isMandatory}
                  onChange={this.handleAmendmentTypeChange}
                  disabled={isAmendmentTypeDecided}
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
                  onClick={this.onNextClicked}
                  disabled={isAmendmentTypeDecided ? false : !readyToGoNext}
                >
                  Next
                </Button>
              </div>
            </div>
          </Form>

          {isMinor && isThereSingleAH &&
            <MinorTabsForSingle
              clients={clients}
              activeTab={activeTab}
              isAgreed={isAgreed}
              isSubmitting={isSubmitting}
              readyToGoNext={readyToGoNext}
              handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
              onClose={this.onClose}
              onBackClicked={this.onBackClicked}
              onNextClicked={this.onNextClicked}
              onSubmitClicked={this.onSubmitClicked}
            />
          }

          {isMinor && !isThereSingleAH &&
            <MinorTabsForMultiple
              user={user}
              clients={clients}
              activeTab={activeTab}
              isAgreed={isAgreed}
              isSubmitting={isSubmitting}
              readyToGoNext={readyToGoNext}
              handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
              onClose={this.onClose}
              onBackClicked={this.onBackClicked}
              onNextClicked={this.onNextClicked}
              onSubmitClicked={this.onSubmitClicked}
            />
          }

          {isMandatory && isThereSingleAH &&
            <MandatoryTabsForSingle
              clients={clients}
              activeTab={activeTab}
              isAgreed={isAgreed}
              isSubmitting={isSubmitting}
              readyToGoNext={readyToGoNext}
              mandatoryStatusCode={mandatoryStatusCode}
              onClose={this.onClose}
              onSubmitClicked={this.onSubmitClicked}
              onBackClicked={this.onBackClicked}
              onNextClicked={this.onNextClicked}
              handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
              handleMandatoryStatusCodeChange={this.handleMandatoryStatusCodeChange}
            />
          }
          {isMandatory && !isThereSingleAH &&
            <MandatoryTabsForMultiple
              user={user}
              clients={clients}
              activeTab={activeTab}
              isAgreed={isAgreed}
              isSubmitting={isSubmitting}
              readyToGoNext={readyToGoNext}
              mandatoryStatusCode={mandatoryStatusCode}
              onClose={this.onClose}
              onSubmitClicked={this.onSubmitClicked}
              onBackClicked={this.onBackClicked}
              onNextClicked={this.onNextClicked}
              handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
              handleMandatoryStatusCodeChange={this.handleMandatoryStatusCodeChange}
            />
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
  }
);

export default connect(mapStateToProps, {
  updateRUP,
  planUpdated,
})(AmendmentSubmissionModal);
