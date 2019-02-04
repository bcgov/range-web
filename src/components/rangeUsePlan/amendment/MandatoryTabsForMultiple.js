import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Radio, Form, Icon } from 'semantic-ui-react';
import { PLAN_STATUS } from '../../../constants/variables';
import { isClientCurrentUser } from '../../../utils';
import { InvertedButton } from '../../common';

/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */
const propTypes = {
  clients: PropTypes.arrayOf(PropTypes.object),
  activeTab: PropTypes.number.isRequired,
  isAgreed: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  readyToGoNext: PropTypes.bool.isRequired,
  mandatoryStatusCode: PropTypes.string,
  handleAgreeCheckBoxChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitClicked: PropTypes.func.isRequired,
  onBackClicked: PropTypes.func.isRequired,
  onNextClicked: PropTypes.func.isRequired,
  handleMandatoryStatusCodeChange: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
};
const defaultProps = {
  clients: [],
  mandatoryStatusCode: null,
};

class MandatoryTabsForMultiple extends Component {
  renderAgreementHolder = (client) => {
    const { user } = this.props;

    return (
      <div key={client.id} className="amendment__submission__ah-list">
        <Icon name="user outline" />
        <span className={classnames('amendment__submission__ah-list__cname', {
          'amendment__submission__ah-list__cname--bold': isClientCurrentUser(client, user),
        })}
        >
          {client.name}
        </span>
      </div>
    );
  }

  renderTabsWhenSubmittedForReview = () => {
    const { activeTab, onBackClicked, onSubmitClicked, isSubmitting, onClose } = this.props;
    const index = activeTab + 1;

    return (
      <Fragment>
        <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 2 })}>
          <Form>
            <div className="multi-form__tab__title">
              {`${index}. Submit Your Admendment for Review`}
            </div>
            <div style={{ marginBottom: '20px' }}>
              You’re ready to submit mandatory amendment for Range staff review. You will be notified once the submission has been reviewed.
            </div>
            <div className="multi-form__btns">
              <InvertedButton
                className="multi-form__btn"
                primaryColor
                onClick={onBackClicked}
              >
                Back
              </InvertedButton>
              <Button
                className="multi-form__btn"
                primary
                onClick={onSubmitClicked}
                loading={isSubmitting}
              >
                Submit For Review
              </Button>
            </div>
          </Form>
        </div>

        <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 3 })}>
          <div className="amendment__submission__last-tab">
            <Icon style={{ marginBottom: '10px' }} name="check circle outline" size="huge" />
            <div className="amendment__submission__last-tab__title">
              Your mandatory amendment has been sent for range staff review
            </div>
            <div style={{ marginBottom: '20px' }}>
              Your mandatory amendment has been sent to Range staff for review. Feel free to call your Range officer if you have any questions!
            </div>
            <Button
              className="multi-form__btn"
              primary
              onClick={onClose}
            >
              Finish
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    const {
      clients,
      activeTab,
      isAgreed,
      isSubmitting,
      readyToGoNext,
      mandatoryStatusCode,
      onClose,
      onSubmitClicked,
      onBackClicked,
      onNextClicked,
      handleAgreeCheckBoxChange,
      handleMandatoryStatusCodeChange,
    } = this.props;
    const index = activeTab + 1;

    return (
      <Fragment>
        <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 1 })}>
          <Form>
            <div className="multi-form__tab__title">
              {`${index}. Ready to Submit? Choose Your Submission Type`}
            </div>
            <Form.Field className="amendment__submission__radio-field">
              <Radio
                className="amendment__submission__radio"
                label={
                  <label>
                    <b>Submit for Staff Review: </b>
                    Short Description that informs the user that their submission will be reviewed by range staff before they submit for final approval.
                  </label>
                }
                name="radioGroup"
                value={PLAN_STATUS.SUBMITTED_FOR_REVIEW}
                checked={mandatoryStatusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW}
                onChange={handleMandatoryStatusCodeChange}
              />
            </Form.Field>
            <Form.Field className="amendment__submission__radio-field">
              <Radio
                className="amendment__submission__radio"
                label={
                  <label>
                    <b>Submit for Final Decision: </b>
                    Short Description that informs the user that they will be submitting for Final approval and that all Agreement holders will have to review the submission before it is sent to range staff.
                  </label>
                }
                name="radioGroup"
                value={PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION}
                checked={mandatoryStatusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION}
                onChange={handleMandatoryStatusCodeChange}
              />
            </Form.Field>
            <div className="multi-form__btns">
              <InvertedButton
                className="multi-form__btn"
                primaryColor
                onClick={onBackClicked}
              >
                Back
              </InvertedButton>
              <Button
                className="multi-form__btn"
                primary
                onClick={onNextClicked}
                disabled={!readyToGoNext}
              >
                Next
              </Button>
            </div>
          </Form>
        </div>
        { mandatoryStatusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW &&
          this.renderTabsWhenSubmittedForReview()
        }

        { mandatoryStatusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION &&
          <Fragment>
            <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 2 })}>
              <Form>
                <div className="multi-form__tab__title">
                  {`${index}. Confirm Your Submission and eSignature`}
                </div>
                <div style={{ marginBottom: '20px' }}>
                  You’re ready to submit mandatory amendment. Once submitted and confirmed by all agreement holders it willl then be sent to range staff for final decision. You will be notified once the submission has been reviewed.
                </div>
                <Form.Checkbox
                  label="I understand that this submission constitues a legal document and eSignature. This submission will be reviewed the Range Staff."
                  onChange={handleAgreeCheckBoxChange}
                  required
                />
              </Form>
              <div className="multi-form__btns">
                <InvertedButton
                  className="multi-form__btn"
                  primaryColor
                  onClick={onBackClicked}
                >
                  Back
                </InvertedButton>
                <Button
                  className="multi-form__btn"
                  primary
                  onClick={onNextClicked}
                  disabled={!isAgreed}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 3 })}>
              <div className="multi-form__tab__title">
                {`${index}. Request eSignatures and Submit Mandatory Amendment for final decision`}
              </div>
              <div style={{ marginBottom: '20px' }}>
                You’re ready to submit your Mandatory Amendment to your range use plan. The secondary agreement holders below will be notified to confirm the submission and provide eSignatures.
              </div>
              <div style={{ marginBottom: '20px' }}>
                Once all agreement holders have confirmed the submission and provided their eSignature your amendment will be submitted for final decision by Range Staff.
              </div>
              <div className="amendment__submission__ah-list__header">
                Agreement holders needed to confirm submission:
              </div>
              {clients.map(this.renderAgreementHolder)}
              <div className="multi-form__btns">
                <InvertedButton
                  className="multi-form__btn"
                  primaryColor
                  onClick={onBackClicked}
                >
                  Back
                </InvertedButton>
                <Button
                  className="multi-form__btn"
                  primary
                  onClick={onSubmitClicked}
                  loading={isSubmitting}
                >
                  Request eSignatures and Submit
                </Button>
              </div>
            </div>

            <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 4 })}>
              <div className="amendment__submission__last-tab">
                <Icon style={{ marginBottom: '10px' }} name="check circle outline" size="huge" />
                <div className="amendment__submission__last-tab__title">
                  Your mandatory amendment has been sent for eSignatures and final decision by range staff.
                </div>
                <div style={{ marginBottom: '20px' }}>
                  Your mandatory amendment has been sent to agreement holders for confirmation. It will be sent to Range staff for final approval once all agreement holders have viewed and confirmed the submission.
                </div>
                <Button
                  className="multi-form__btn"
                  primary
                  onClick={onClose}
                >
                  Finish
                </Button>
              </div>
            </div>
          </Fragment>
        }
      </Fragment>
    );
  }
}

MandatoryTabsForMultiple.propTypes = propTypes;
MandatoryTabsForMultiple.defaultProps = defaultProps;
export default MandatoryTabsForMultiple;
