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
import { isSingleClient, isMinorAmendment, isMandatoryAmendment } from '../../../utils';

/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
const propTypes = {
  user: PropTypes.shape({}).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  plan: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object),
  updateRUP: PropTypes.func.isRequired,
  planUpdated: PropTypes.func.isRequired,
  updateStatusAndContent: PropTypes.func.isRequired,
};
const defaultProps = {
  clients: [],
};

class AmendmentSubmissionModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => (
    {
      activeTab: 0,
      amendmentType: null,
      mandatorySubmissionType: null,
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
    }));
  }

  onBackClicked = () => {
    this.setState(prevState => ({
      readyToGoNext: true,
      activeTab: prevState.activeTab - 1,
    }));
  }

  onSubmitClicked = () => {
    const { plan, references, clients } = this.props;
    const { amendmentType, mandatorySubmissionType } = this.state;
    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS];
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const minor = amendmentTypes.find(at => at.code === AMENDMENT_TYPE.MINOR);
    const mandatory = amendmentTypes.find(at => at.code === AMENDMENT_TYPE.MANDATORY);

    if (isMinorAmendment(amendmentType) && isSingleClient(clients)) {
      const stands = planStatuses.find(s => s.code === PLAN_STATUS.STANDS);
      this.submitAmendment(plan, stands, minor);
      return;
    }

    if (isMinorAmendment(amendmentType) && !isSingleClient(clients)) {
      const confirmationAwaiting = planStatuses.find(s => s.code === PLAN_STATUS.AWAITING_CONFIRMATION);
      this.submitAmendment(plan, confirmationAwaiting, minor);
      return;
    }

    if (isMandatoryAmendment(amendmentType) && isSingleClient(clients)) {
      const planStatus = planStatuses.find(s => s.code === mandatorySubmissionType);
      this.submitAmendment(plan, planStatus, mandatory);
      return;
    }

    if (isMandatoryAmendment(amendmentType) && !isSingleClient(clients)) {
      // do something
    }
  }

  submitAmendment = (plan, planStatus, amendmentType) => {
    const {
      updateRUP,
      planUpdated,
      updateStatusAndContent,
    } = this.props;

    const onRequest = () => {
      this.setState({ isSubmitting: true });
    };
    const onSuccess = () => {
      // update amendment type of the plan
      updateRUP(plan.id, {
        amendmentTypeId: amendmentType.id,
      }).then((updatedPlan) => {
        this.onNextClicked();
        planUpdated({ plan: { ...plan, ...updatedPlan } });
        this.setState({ isSubmitting: false });
      });
    };
    const onError = () => {
      this.onClose();
    };

    updateStatusAndContent(planStatus, onRequest, onSuccess, onError);
  }

  handleAmendmentTypeChange = (e, { value: amendmentType }) => {
    this.setState({ amendmentType, readyToGoNext: true });
  }

  handleAgreeCheckBoxChange = (e, { checked }) => {
    this.setState({ isAgreed: checked, readyToGoNext: true });
  }

  handleMandatorySubmissionTypeChange = (e, { value: mandatorySubmissionType }) => {
    this.setState({ mandatorySubmissionType, readyToGoNext: true });
  }

  render() {
    const {
      activeTab, amendmentType, readyToGoNext, isAgreed,
      isSubmitting, mandatorySubmissionType,
    } = this.state;
    const { open, clients, user } = this.props;
    const index = activeTab + 1;
    const isThereSingleAH = isSingleClient(clients);

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
                  checked={amendmentType === AMENDMENT_TYPE.MINOR}
                  onChange={this.handleAmendmentTypeChange}
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
                  checked={amendmentType === AMENDMENT_TYPE.MANDATORY}
                  onChange={this.handleAmendmentTypeChange}
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
                  disabled={!readyToGoNext}
                >
                  Next
                </Button>
              </div>
            </div>
          </Form>

          {(amendmentType === AMENDMENT_TYPE.MINOR) && isThereSingleAH &&
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

          {(amendmentType === AMENDMENT_TYPE.MINOR) && !isThereSingleAH &&
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

          {(amendmentType === AMENDMENT_TYPE.MANDATORY) && isThereSingleAH &&
            <MandatoryTabsForSingle
              clients={clients}
              activeTab={activeTab}
              isAgreed={isAgreed}
              isSubmitting={isSubmitting}
              readyToGoNext={readyToGoNext}
              mandatorySubmissionType={mandatorySubmissionType}
              onClose={this.onClose}
              onSubmitClicked={this.onSubmitClicked}
              onBackClicked={this.onBackClicked}
              onNextClicked={this.onNextClicked}
              handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
              handleMandatorySubmissionTypeChange={this.handleMandatorySubmissionTypeChange}
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

AmendmentSubmissionModal.propTypes = propTypes;
AmendmentSubmissionModal.defaultProps = defaultProps;
export default connect(mapStateToProps, {
  updateRUP,
  planUpdated,
})(AmendmentSubmissionModal);
