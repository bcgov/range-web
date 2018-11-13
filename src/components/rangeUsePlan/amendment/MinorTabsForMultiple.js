import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Icon, Form } from 'semantic-ui-react';
import { isClientCurrentUser } from '../../../utils';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object),
  activeTab: PropTypes.number.isRequired,
  isAgreed: PropTypes.bool.isRequired,
  handleAgreeCheckBoxChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onBackClicked: PropTypes.func.isRequired,
  onNextClicked: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onSubmitClicked: PropTypes.func.isRequired,
};
const defaultProps = {
  clients: [],
};

// display submission steps when there are multiple clients
class MinorTabsForMultiple extends Component {
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

  render() {
    const {
      clients,
      activeTab,
      isAgreed,
      handleAgreeCheckBoxChange,
      onClose,
      onBackClicked,
      onNextClicked,
      isSubmitting,
      onSubmitClicked,
    } = this.props;
    const index = activeTab + 1;

    return (
      <Fragment>
        <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 1 })}>
          <Form>
            <div className="multi-form__tab__title">
              {`${index}. Finalize and Sign Your Submission and eSignature`}
            </div>
            <div style={{ marginBottom: '10px' }}>
              You are about to finalize and sign a minor amendment to your RUP. No approval is required for minor amendments. Your RUP will be automatically updated when all agreement holders have reviewed and signed the amendment. This amendment may be reviewed by range staff for consistency with minor amendment requirements.
            </div>
            <div style={{ marginBottom: '20px' }}>
              You will be notified if it did not meet requirements including if it has been rescinded and you must follow your pre-amendment RUP.
            </div>
            <Form.Checkbox
              label="I understand that this submission constitues a legal document and eSignature."
              onChange={handleAgreeCheckBoxChange}
              required
            />
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
            {`${index}. Confirm Signature and Submit`}
          </div>
          <div style={{ marginBottom: '20px' }}>
            You’re ready to submit your Minor Amendment to your range use plan. The other agreement holders below will be notified to confirm the submission and provide eSignatures.
          </div>
          <div style={{ marginBottom: '20px' }}>
            Once all agreement holders have confirmed the submission and provided their eSignatures, your RUP will be updated as approval is not required for minor amendments. This submission may be reviewed by range staff for consistency with minor amendment requirements.
          </div>
          <div className="amendment__submission__ah-list__header">
            All other agreement holders required to sign this amendment are listed below.
          </div>
          {clients.map(this.renderAgreementHolder)}
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
              loading={isSubmitting}
            >
              Confirm Signature
            </Button>
          </div>
        </div>

        <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 3 })}>
          <div className="amendment__submission__last-tab">
            <Icon style={{ marginBottom: '10px' }} name="check circle outline" color="green" size="huge" />
            <div className="amendment__submission__last-tab__title">
            You have successfully signed this minor amendment and submitted it to other agreement holders for signature
            </div>
            <div style={{ marginBottom: '10px' }}>
              No approval is required for minor amendments. Your RUP will be automatically updated when all agreement holders have reviewed and signed the amendment. This amendment may be reviewed by range staff for consistency with minor amendment requirements.
            </div>
            <div style={{ marginBottom: '20px' }}>
              You only will be notified if it did not meet requirements including if it has been rescinded and you must follow your pre-amendment RUP.
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

MinorTabsForMultiple.propTypes = propTypes;
MinorTabsForMultiple.defaultProps = defaultProps;
export default MinorTabsForMultiple;
