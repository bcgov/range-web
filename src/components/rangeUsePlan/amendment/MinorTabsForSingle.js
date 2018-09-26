import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Checkbox, Icon, Form } from 'semantic-ui-react';

const propTypes = {
  activeTab: PropTypes.number.isRequired,
  isAgreed: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleAgreeCheckBoxChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onBackClicked: PropTypes.func.isRequired,
  onSubmitClicked: PropTypes.func.isRequired,
};

// display submission tabs when there is only one primary agreement holder
class MinorTabsForSingle extends Component {
  render() {
    const {
      activeTab,
      isAgreed,
      isSubmitting,
      onSubmitClicked,
      handleAgreeCheckBoxChange,
      onClose,
      onBackClicked,
    } = this.props;
    const index = activeTab + 1;

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
            <Icon style={{ marginBottom: '10px' }} name="check circle outline" color="green" size="huge" />
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
}

MinorTabsForSingle.propTypes = propTypes;
export default MinorTabsForSingle;
