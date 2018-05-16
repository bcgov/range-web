import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { DETAIL_RUP_EDIT_BANNER_CONTENT, SAVE_PLAN_AS_DRAFT_SUCCESS, SUBMIT_PLAN_SUCCESS } from '../../constants/strings';
import { Status, ConfirmationModal, Banner } from '../common';
import RupBasicInformation from './RupBasicInformation';
import RupPastures from './RupPastures';
import RupSchedules from './RupSchedules';
import EditRupSchedules from './EditRupSchedules';
import { DRAFT, PENDING } from '../../constants/variables';
import { isRupComplete, isRupCreated, isRupChangedRequested, isRupPending, isRupInDraftByAH } from '../../handlers';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  agreement: PropTypes.shape({ plan: PropTypes.object }).isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  statuses: PropTypes.arrayOf(PropTypes.object).isRequired,
  createOrUpdateRupSchedule: PropTypes.func.isRequired,
  updateRupStatus: PropTypes.func.isRequired,
  toastErrorMessage: PropTypes.func.isRequired,
  toastSuccessMessage: PropTypes.func.isRequired,
};

export class EditRupByAH extends Component {
  constructor(props) {
    super(props);

    // store fields that can be updated within this page
    const { plan } = props.agreement;
    const { status } = plan || {};

    this.state = {
      plan,
      status,
      isSubmitModalOpen: false,
    };
  }

  componentDidMount() {
    this.stickyHeader = document.getElementById('edit-rup-sticky-header');
    // requires the absolute offsetTop value
    this.stickyHeaderOffsetTop = this.stickyHeader.offsetTop;
    this.scrollListner = window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListner);
  }

  onSaveDraftClick = () => {
    const {
      agreement,
      statuses,
      toastSuccessMessage,
    } = this.props;

    this.setState({ isSavingAsDraft: true });

    const plan = agreement && agreement.plan;
    const status = statuses.find(s => s.name === DRAFT);

    const onUpdated = () => {
      toastSuccessMessage(SAVE_PLAN_AS_DRAFT_SUCCESS);
      this.setState({
        isSavingAsDraft: false,
        status,
      });
    };
    this.updateRupStatusAndContent(plan, status, onUpdated);
  }

  onSubmitClicked = () => {
    const {
      agreement,
      statuses,
      toastSuccessMessage,
    } = this.props;

    this.setState({ isSubmitting: true });

    const plan = agreement && agreement.plan;
    const status = statuses.find(s => s.name === PENDING);

    const onUpdated = () => {
      toastSuccessMessage(SUBMIT_PLAN_SUCCESS);
      this.setState({
        isSubmitting: false,
        isSubmitModalOpen: false,
        status,
      });
    };
    this.updateRupStatusAndContent(plan, status, onUpdated);
  }

  closeSubmitConfirmModal = () => this.setState({ isSubmitModalOpen: false })
  openSubmitConfirmModal = () => this.setState({ isSubmitModalOpen: true })

  updateRupStatusAndContent = (plan, status, onSuccess) => {
    const {
      createOrUpdateRupSchedule,
      updateRupStatus,
      toastErrorMessage,
    } = this.props;

    const planId = plan && plan.id;
    const statusId = status && status.id;
    const grazingSchedules = plan && plan.grazingSchedules;
    if (planId && statusId && grazingSchedules) {
      const makeRequest = async () => {
        try {
          await updateRupStatus({ planId, statusId }, false);
          await Promise.all(grazingSchedules.map(schedule => (
            createOrUpdateRupSchedule({ planId, schedule })
          )));

          onSuccess();
        } catch (err) {
          toastErrorMessage(err);
          throw err;
        }
      };
      makeRequest();
    }
  }
  handleScroll = () => {
    if (this.stickyHeader) {
      if (window.pageYOffset >= this.stickyHeaderOffsetTop) {
        this.stickyHeader.classList.add('rup__sticky--fixed');
      } else {
        this.stickyHeader.classList.remove('rup__sticky--fixed');
      }
    }
  }

  handleSchedulesChange = (schedules) => {
    const { plan } = this.state;
    plan.grazingSchedules = schedules;
    this.setState({
      plan,
    });
  }

  renderBanner = (agreementId, status) => {
    let content = '';
    if (isRupCreated(status)) {
      content = 'Please confirm your range use plan.';
    } else if (isRupInDraftByAH(status)) {
      content = 'Please finalize your changes and submit for Range staff review.';
    } else if (isRupPending(status)) {
      content = 'Your range use plan is currently being reviewed by range staff.';
    } else if (isRupChangedRequested(status)) {
      content = 'Your range use plan was reviewed by Range staff and requires revisions. Please make changes and resubmit.';
    } else if (isRupComplete(status)) {
      content = 'Your range use plan is approved by Range staff.';
    }
    return (
      <Banner
        className="banner__edit-rup"
        header={agreementId}
        content={content}
      />
    );
  }

  render() {
    const {
      plan,
      status,
      isSavingAsDraft,
      isSubmitting,
      isSubmitModalOpen,
    } = this.state;

    const {
      user,
      agreement,
      livestockTypes,
    } = this.props;

    const isEditable = isRupCreated(status) || isRupInDraftByAH(status) || isRupChangedRequested(status);

    const agreementId = agreement && agreement.id;
    const zone = agreement && agreement.zone;
    const usage = agreement && agreement.usage;

    let rupSchedules;
    if (isEditable) {
      rupSchedules = (
        <EditRupSchedules
          className="rup__edit-schedules"
          livestockTypes={livestockTypes}
          plan={plan}
          usage={usage}
          handleSchedulesChange={this.handleSchedulesChange}
        />
      );
    } else {
      rupSchedules = (
        <RupSchedules
          className="rup__schedules"
          usage={usage}
          plan={plan}
          status={status}
        />
      );
    }

    return (
      <div className="rup">
        <ConfirmationModal
          open={isSubmitModalOpen}
          header="Confirmation: Submit"
          content="Are you sure you want to submit the change to the range staff?"
          onNoClicked={this.closeSubmitConfirmModal}
          onYesClicked={this.onSubmitClicked}
          loading={isSubmitting}
        />

        {this.renderBanner(agreementId, status)}

        <div
          id="edit-rup-sticky-header"
          className="rup__sticky"
        >
          <div className="rup__sticky__container">
            <div className="rup__sticky__left">
              <div className="rup__sticky__title">{agreementId}</div>
              <Status
                className="rup__status"
                status={status}
                user={user}
              />
            </div>
            <div className="rup__sticky__btns">
              <Button
                loading={isSavingAsDraft}
                disabled={!isEditable}
                onClick={this.onSaveDraftClick}
              >
                Save Draft
              </Button>
              <Button
                loading={isSubmitting}
                disabled={!isEditable}
                onClick={this.openSubmitConfirmModal}
                style={{ marginLeft: '15px' }}
              >
                Submit for Review
              </Button>
            </div>
          </div>
        </div>

        <div className="rup__content">
          <RupBasicInformation
            className="rup__basic_information"
            agreement={agreement}
            plan={plan}
            zone={zone}
            user={user}
          />

          <RupPastures
            className="rup__pastures"
            plan={plan}
          />

          {rupSchedules}
        </div>
      </div>
    );
  }
}

EditRupByAH.propTypes = propTypes;
export default EditRupByAH;
