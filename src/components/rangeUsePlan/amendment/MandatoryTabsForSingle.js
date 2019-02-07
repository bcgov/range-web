import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Radio, Form, Icon } from 'semantic-ui-react';
import { PLAN_STATUS } from '../../../constants/variables';
import { InvertedButton } from '../../common';

/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */
const propTypes = {
  activeTab: PropTypes.number.isRequired,
  isAgreed: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  mandatoryStatusCode: PropTypes.string,
  handleAgreeCheckBoxChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitClicked: PropTypes.func.isRequired,
  onBackClicked: PropTypes.func.isRequired,
  onNextClicked: PropTypes.func.isRequired,
  handleMandatoryStatusCodeChange: PropTypes.func.isRequired,
};
const defaultProps = {
  mandatoryStatusCode: null,
};

class MandatoryTabsForSingle extends Component {
  render() {
    const {
      activeTab,
      isAgreed,
      isSubmitting,
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
                    <b>Submit for Staff Feedback: </b>
                    Make this draft amendment available for the staff to review. They will advise you if the RUP is ready to submit to the decision maker for approval.
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
                    Verify this amendment is correct and start submission for decision.
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
                disabled={!mandatoryStatusCode}
              >
                Next
              </Button>
            </div>
          </Form>
        </div>

        { mandatoryStatusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION &&
          <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 2 })}>
            <Form>
              <div className="multi-form__tab__title">
                {`${index}. Confirm Your Submission and eSignature`}
              </div>
              <div style={{ marginBottom: '20px' }}>
                You are about to submit your Mandatory Amendment for your RUP.
              </div>
              <Form.Checkbox
                label="I understand that this submission constitues a legal document and eSignature. This submission will be reviewed the Range Staff."
                onChange={handleAgreeCheckBoxChange}
                required
              />
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
                  disabled={!isAgreed}
                >
                  Submit Amendment
                </Button>
              </div>
            </Form>
          </div>
        }

        { mandatoryStatusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW &&
          <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 2 })}>
            <Form>
              <div className="multi-form__tab__title">
                {`${index}. Submit Your Amendment for Review`}
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
                  Submit For Feedback
                </Button>
              </div>
            </Form>
          </div>
        }

        <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 3 })}>
          <div className="amendment__submission__last-tab">
            <Icon style={{ marginBottom: '10px' }} name="check circle outline" size="huge" />
            <div className="amendment__submission__last-tab__title">Your mandatory amendment has been sent for range staff review.</div>
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
}

MandatoryTabsForSingle.propTypes = propTypes;
MandatoryTabsForSingle.defaultProps = defaultProps;
export default MandatoryTabsForSingle;
