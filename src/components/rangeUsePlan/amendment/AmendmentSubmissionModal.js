import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Modal, Icon, Form, Radio } from 'semantic-ui-react';
import { AMENDMENT_TYPE, REFERENCE_KEY, PLAN_STATUS } from '../../../constants/variables';
import { getReferences } from '../../../reducers/rootReducer';
import { updateRUP } from '../../../actionCreators/planActionCreator';
import { planUpdated } from '../../../actions';
import MinorSubmissionTabs from './MinorSubmissionTabs';
import MandatoySubmissionTabs from './MandatoySubmissionTabs';

const propTypes = {
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
    const { plan, references } = this.props;
    const { amendmentType, mandatorySubmissionType } = this.state;
    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS];
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const minor = amendmentTypes.find(at => at.code === AMENDMENT_TYPE.MINOR);
    const mandatory = amendmentTypes.find(at => at.code === AMENDMENT_TYPE.MANDATORY);

    if (amendmentType === AMENDMENT_TYPE.MINOR) {
      const stands = planStatuses.find(s => s.code === PLAN_STATUS.STANDS);
      this.submitAmendment(plan, stands, minor);
    } else if (amendmentType === AMENDMENT_TYPE.MANDATORY) {
      const planStatus = planStatuses.find(s => s.code === mandatorySubmissionType);
      this.submitAmendment(plan, planStatus, mandatory);
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
    const { open, clients } = this.props;
    const index = activeTab + 1;

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
                  label=""
                  name="radioGroup"
                  value={AMENDMENT_TYPE.MINOR}
                  checked={amendmentType === AMENDMENT_TYPE.MINOR}
                  onChange={this.handleAmendmentTypeChange}
                />
                <div>
                  <b>Minor Amendment: </b>
                  Short Description of what a minor amendment is. Provide clarification of what constitutes a minor amendment.
                </div>
              </Form.Field>
              <Form.Field className="amendment__submission__radio-field">
                <Radio
                  className="amendment__submission__radio"
                  label=""
                  name="radioGroup"
                  value={AMENDMENT_TYPE.MANDATORY}
                  checked={amendmentType === AMENDMENT_TYPE.MANDATORY}
                  onChange={this.handleAmendmentTypeChange}
                />
                <div>
                  <b>Mandatory Amendment: </b>
                  Short Description of what a mandatory amendment is. Provide clarification of what constitutes a mandatory amendment.
                </div>
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
          { amendmentType === AMENDMENT_TYPE.MINOR &&
            <MinorSubmissionTabs
              clients={clients}
              activeTab={activeTab}
              isAgreed={isAgreed}
              isSubmitting={isSubmitting}
              handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
              onClose={this.onClose}
              onBackClicked={this.onBackClicked}
              onSubmitClicked={this.onSubmitClicked}
            />
          }
          { amendmentType === AMENDMENT_TYPE.MANDATORY &&
            <MandatoySubmissionTabs
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
    references: getReferences(state),
  }
);

AmendmentSubmissionModal.propTypes = propTypes;
AmendmentSubmissionModal.defaultProps = defaultProps;
export default connect(mapStateToProps, {
  updateRUP,
  planUpdated,
})(AmendmentSubmissionModal);
