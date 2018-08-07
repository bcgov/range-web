import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Checkbox, Modal, Icon, Form, Radio } from 'semantic-ui-react';
import { AMENDMENT_TYPE, REFERENCE_KEY, PLAN_STATUS } from '../../constants/variables';
import { getReferences } from '../../reducers/rootReducer';
import { updateRUP } from '../../actionCreators/planActionCreator';
import { updatePlan } from '../../actions';

const propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  plan: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  updateRUP: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
};

/* eslint-disable arrow-body-style */
class AmendmentSubmissionModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      activeTab: 0,
      amendmentType: null,
      isAgreed: false,
      readyToGoNext: false,
    };
  }

  onClose = () => {
    this.setState(this.getInitialState());
    this.props.onClose();
  }

  onNextClicked = () => {
    this.setState({
      readyToGoNext: false,
      activeTab: this.state.activeTab + 1,
    });
  }

  onSubmitClicked = () => {
    const {
      plan,
      references,
      updateRUP,
      updatePlan,
    } = this.props;
    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS];
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    if (this.state.amendmentType === AMENDMENT_TYPE.MINOR) {
      const stands = planStatuses.find(s => s.code === PLAN_STATUS.STANDS);
      const minor = amendmentTypes.find(at => at.code === AMENDMENT_TYPE.MINOR);
      const onSuccess = (updatedPlan) => {
        this.onClose();
        updatePlan({ plan: { ...plan, ...updatedPlan } });
      };

      // update status id and amendment type of the plan at the same time
      updateRUP(plan.id, {
        status_id: stands.id,
        amendmentTypeId: minor.id,
      }).then(onSuccess);
    }
  }

  handleAmendmentTypeChange = (e, { value: amendmentType }) => {
    this.setState({ amendmentType, readyToGoNext: true });
  }

  handleAgreeCheckBoxChange = (e, { checked }) => {
    this.setState({ isAgreed: checked, readyToGoNext: true });
  }

  renderBtnsWithNext = () => {
    const { readyToGoNext } = this.state;
    return (
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
    );
  }

  renderBtnsWithSubmit = () => {
    const { isAgreed } = this.state;

    return (
      <div className="multi-form__btns">
        <Button
          className="multi-form__btn"
          onClick={this.onClose}
        >
          Cancel
        </Button>
        <Button
          className="multi-form__btn"
          onClick={this.onSubmitClicked}
          disabled={!isAgreed}
        >
          Submit Amendment
        </Button>
      </div>
    );
  }

  render() {
    const { activeTab, amendmentType } = this.state;
    const { open } = this.props;
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
              <div className="multi-form__tab__title">{index}. Ready to Submit? Choose Your Amendment Type</div>
              <Form.Field>
                <Radio
                  label="Minor Amendment: Short Description of what a minor amendment is. Provide clarification of what constitutes a minor amendment."
                  name="radioGroup"
                  value={AMENDMENT_TYPE.MINOR}
                  checked={amendmentType === AMENDMENT_TYPE.MINOR}
                  onChange={this.handleAmendmentTypeChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  disabled
                  label="Mandatory Amendment: Short Description of what a mandatory amendment is. Provide clarification of what constitutes a mandatory amendment."
                  name="radioGroup"
                  value={AMENDMENT_TYPE.MANDATORY}
                  checked={amendmentType === AMENDMENT_TYPE.MANDATORY}
                  onChange={this.handleAmendmentTypeChange}
                />
              </Form.Field>
              {this.renderBtnsWithNext()}
            </div>
            <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 1 })}>
              <div className="multi-form__tab__title">{index}. Confirm Your Submission and eSignature</div>
              <div style={{ marginBottom: '20px' }}>
                You are about to submit your Minor Amendment for your RUP. Minor Amendments to your range plan take effect immediately once submitted.
              </div>
              <Form.Field>
                <Checkbox
                  label="I understand that this submission constitues a legal document and eSignature. Changes to the current Range Use Plan will be take effect immediatly."
                  onChange={this.handleAgreeCheckBoxChange}
                />
              </Form.Field>
              {this.renderBtnsWithSubmit()}
            </div>
          </Form>
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
export default connect(mapStateToProps, {
  updateRUP,
  updatePlan,
})(AmendmentSubmissionModal);
