import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Checkbox, Icon, Form } from 'semantic-ui-react';

const propTypes = {
  clients: PropTypes.arrayOf(PropTypes.object),
  activeTab: PropTypes.number.isRequired,
  isAgreed: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleAgreeCheckBoxChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onBackClicked: PropTypes.func.isRequired,
  onSubmitClicked: PropTypes.func.isRequired,
  onNextClicked: PropTypes.func.isRequired,
};
const defaultProps = {
  clients: [],
};

class MinorAmendmentTabs extends Component {
  render() {
    const {
      clients, activeTab, isAgreed,
      isSubmitting, handleAgreeCheckBoxChange, onClose,
      onSubmitClicked, onBackClicked, onNextClicked,
    } = this.props;
    const index = activeTab + 1;

    // when there is only one primary agreement holder
    if (clients.length === 1) {
      return (
        <Fragment>
          <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 1 })}>
            <Form>
              <div className="multi-form__tab__title">
                {`${index}. Confirm Your Submission and eSignature`}
              </div>
              <div style={{ marginBottom: '20px' }}>
                You are about to submit your Minor Amendment for your RUP. Minor Amendments to your range plan take effect immediately once submitted.
              </div>
              <Form.Field>
                <Checkbox
                  label="I understand that this submission constitues a legal document and eSignature. Changes to the current Range Use Plan will be take effect immediatly."
                  onChange={handleAgreeCheckBoxChange}
                />
              </Form.Field>
              <div className="multi-form__btns">
                <Button
                  className="multi-form__btn"
                  onClick={onBackClicked}
                >
                  Back
                </Button>
                <Button
                  className="multi-form__btn"
                  onClick={onSubmitClicked}
                  disabled={!isAgreed}
                  loading={isSubmitting}
                >
                  Submit Amendment
                </Button>
              </div>
            </Form>
          </div>
          <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 2 })}>
            <div className="amendment__submission__last-tab">
              <Icon style={{ marginBottom: '10px' }} name="check circle outline" size="huge" />
              <div className="amendment__submission__last-tab__title">Your Minor Amendment has been applied to your range use plan.</div>
              <div style={{ marginBottom: '20px' }}>
                Your minor amendment has been applied to your active range use plan. No further action is required unless Range Staff finds errors in your submission.
              </div>
              <Button
                className="multi-form__btn"
                onClick={onClose}
              >
                Finish
              </Button>
            </div>
          </div>
        </Fragment>
      );
    }
    // show different steps in case when there are multiple clients
    return (
      <Fragment>
        <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 1 })}>
          <Form>
            <div className="multi-form__tab__title">
              {`${index}. Confirm Your Submission and eSignature`}
            </div>
            <div style={{ marginBottom: '20px' }}>
              You are about to submit a minor amendment for your Range Use Plan. Your RUP will be updated immediately following submission and collection of other agreement holder signatures as approval is not required for minor amendments. This submission may be reviewed by range staff for consistency with minor amendment requirements.
            </div>
            <Form.Field>
              <Checkbox
                label="I understand that this submission constitues a legal document and eSignature."
                onChange={handleAgreeCheckBoxChange}
              />
            </Form.Field>
          </Form>
          <div className="multi-form__btns">
            <Button
              className="multi-form__btn"
              onClick={onBackClicked}
            >
              Back
            </Button>
            <Button
              className="multi-form__btn"
              onClick={onNextClicked}
              disabled={!isAgreed}
            >
              Next
            </Button>
          </div>
        </div>
        <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 2 })}>
          <div className="multi-form__tab__title">
            {`${index}. Request eSignatures to Submit Minor Amendment`}
          </div>
          <div style={{ marginBottom: '20px' }}>
            You’re ready to submit your Minor Amendment to your range use plan. The other agreement holders below will be notified to confirm the submission and provide eSignatures.
          </div>
          <div style={{ marginBottom: '20px' }}>
            Once all agreement holders have confirmed the submission and provided their eSignatures your RUP will be updated as approval is not required for minor amendments. This submission may be reviewed by range staff for consistency with minor amendment requirements.
          </div>
          <div className="amendment__submission__ah-list__header">
            Agreement holders needed to confirm submission:
          </div>
          <Icon name="user outline" />
          <span className="amendment__submission__ah-list__name">hello</span>
          <div className="multi-form__btns">
            <Button
              className="multi-form__btn"
              onClick={onBackClicked}
            >
              Back
            </Button>
            <Button
              className="multi-form__btn"
              onClick={onNextClicked}
            >
              Request eSignatures and Submit
            </Button>
          </div>
        </div>
        <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 3 })}>
          <div className="amendment__submission__last-tab">
            <Icon style={{ marginBottom: '10px' }} name="check circle outline" size="huge" />
            <div className="amendment__submission__last-tab__title">
              Your minor amendment has been sent for eSignatures and Submission
            </div>
            <div style={{ marginBottom: '20px' }}>
              Your amendment has been sent to agreement holders for confirmation. Once all agreement holders have confirmed the submission and provided their eSignature your amendmentwill take effect immediatly. No further action is required unless range staff find errors in your submission.
            </div>
            <Button
              className="multi-form__btn"
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

MinorAmendmentTabs.propTypes = propTypes;
MinorAmendmentTabs.defaultProps = defaultProps;
export default MinorAmendmentTabs;
