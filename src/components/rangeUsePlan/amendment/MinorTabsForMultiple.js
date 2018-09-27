import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Checkbox, Icon, Form } from 'semantic-ui-react';
import { isClientTheUser } from '../../../utils';

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
          'amendment__submission__ah-list__cname--bold': isClientTheUser(client, user),
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
            Once all agreement holders have confirmed the submission and provided their eSignatures, your RUP will be updated as approval is not required for minor amendments. This submission may be reviewed by range staff for consistency with minor amendment requirements.
          </div>
          <div className="amendment__submission__ah-list__header">
            Agreement holders needed to confirm submission:
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
              Request eSignatures and Submit
            </Button>
          </div>
        </div>

        <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 3 })}>
          <div className="amendment__submission__last-tab">
            <Icon style={{ marginBottom: '10px' }} name="check circle outline" color="green" size="huge" />
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

MinorTabsForMultiple.propTypes = propTypes;
MinorTabsForMultiple.defaultProps = defaultProps;
export default MinorTabsForMultiple;
