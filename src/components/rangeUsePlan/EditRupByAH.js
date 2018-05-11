import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { DETAIL_RUP_EDIT_BANNER_CONTENT, SAVE_PLAN_AS_DRAFT_SUCCESS } from '../../constants/strings';
import { Status, Banner } from '../common';
import RupBasicInformation from './RupBasicInformation';
import RupPastures from './RupPastures';
import RupSchedules from './RupSchedules';
import EditRupSchedules from './EditRupSchedules';
import { CREATED, DRAFT, CHANGE_REQUESTED, PENDING } from '../../constants/variables';

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
    } = this.props;

    this.setState({ isSavingAsDraft: true });

    const plan = agreement && agreement.plan;
    const status = statuses.find(s => s.name === DRAFT);

    this.updateRupStatusAndContent(plan, status, true);
  }

  onSubmitClicked = () => {
    const {
      agreement,
      statuses,
    } = this.props;

    this.setState({ isSubmitting: true });

    const plan = agreement && agreement.plan;
    const status = statuses.find(s => s.name === PENDING);

    this.updateRupStatusAndContent(plan, status, false);
  }

  updateRupStatusAndContent = (plan, status, isDraft) => {
    const {
      createOrUpdateRupSchedule,
      updateRupStatus,
      toastErrorMessage,
      toastSuccessMessage,
    } = this.props;

    const planId = plan && plan.id;
    const statusId = status && status.id;
    const grazingSchedules = plan && plan.grazingSchedules;
    if (planId && statusId && grazingSchedules) {
      const makeRequest = async () => {
        try {
          const newStatus = await updateRupStatus({ planId, statusId });
          await Promise.all(grazingSchedules.map(schedule => (
            createOrUpdateRupSchedule({ planId, schedule })
          )));

          this.setState({
            isSavingAsDraft: false,
            isSubmitting: false,
            status: newStatus,
          });
          toastSuccessMessage(isDraft ? SAVE_PLAN_AS_DRAFT_SUCCESS : 'Submit success!');
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

  render() {
    const {
      plan,
      status,
      isSavingAsDraft,
      isSubmitting,
    } = this.state;

    const {
      user,
      agreement,
      livestockTypes,
    } = this.props;

    const statusName = status && status.name;
    const agreementId = agreement && agreement.id;
    const zone = agreement && agreement.zone;
    const usage = agreement && agreement.usage;
    const isEditable = statusName === CREATED || statusName === DRAFT || statusName === CHANGE_REQUESTED;

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
          plan={plan}
        />
      );
    }

    return (
      <div className="rup">
        <Banner
          className="banner__edit-rup"
          header={agreementId}
          content={DETAIL_RUP_EDIT_BANNER_CONTENT}
        />

        <div
          id="edit-rup-sticky-header"
          className="rup__sticky"
        >
          <div className="rup__sticky__container">
            <div className="rup__sticky__left">
              <div className="rup__sticky__title">{agreementId}</div>
              <Status
                className="rup__status"
                status={statusName}
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
                onClick={this.onSubmitClicked}
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
