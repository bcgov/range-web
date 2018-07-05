import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Status, ConfirmationModal, Banner } from '../common';
import RupBasicInformation from './view/RupBasicInformation';
import RupPastures from './view/RupPastures';
import RupGrazingSchedules from './view/RupGrazingSchedules';
import RupMinisterIssues from './view/RupMinisterIssues';
import EditRupGrazingSchedules from './edit/EditRupGrazingSchedules';
import { ELEMENT_ID, PLAN_STATUS, REFERENCE_KEY } from '../../constants/variables';
import { SUBMIT_RUP_CHANGE_FOR_AH_HEADER, SUBMIT_RUP_CHANGE_FOR_AH_CONTENT } from '../../constants/strings';
import * as utils from '../../utils';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  agreement: PropTypes.shape({ plan: PropTypes.object }).isRequired,
  references: PropTypes.shape({}).isRequired,
  plan: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  ministerIssuesMap: PropTypes.shape({}).isRequired,
  updatePlanStatus: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
  createOrUpdateRupSchedule: PropTypes.func.isRequired,
  updateGrazingSchedule: PropTypes.func.isRequired,
  // toastErrorMessage: PropTypes.func.isRequired,
  // toastSuccessMessage: PropTypes.func.isRequired,
};

export class RupAH extends Component {
  state = {
    isSubmitModalOpen: false,
    isSavingAsDraft: false,
    isSubmitting: false,
  };

  componentDidMount() {
    this.stickyHeader = document.getElementById(ELEMENT_ID.RUP_STICKY_HEADER);
    if (this.stickyHeader) {
      // requires the absolute offsetTop value
      this.stickyHeaderOffsetTop = this.stickyHeader.offsetTop;
      this.scrollListner = window.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListner);
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

  onSaveDraftClick = () => {
    const {
      plan,
      references,
      updatePlan,
      updateGrazingSchedule,
      // toastSuccessMessage,
    } = this.props;
    const planStatus = references[REFERENCE_KEY.PLAN_STATUS];
    const status = planStatus.find(s => s.name === PLAN_STATUS.DRAFT);
    const onRequested = () => {
      this.setState({ isSavingAsDraft: true });
    };
    const onSuccess = (newSchedules) => {
      // generate a list of schedule ids
      const grazingSchedules = newSchedules.map((grazingSchedule) => {
        updateGrazingSchedule({ grazingSchedule });
        return grazingSchedule.id;
      });
      // update schedules in Redux store
      const newPlan = { ...plan, status, grazingSchedules };
      updatePlan({ plan: newPlan });
      this.setState({ isSavingAsDraft: false });
      // toastSuccessMessage(SAVE_PLAN_AS_DRAFT_SUCCESS);
    };
    const onFailed = () => {
      this.setState({ isSavingAsDraft: false });
    };

    this.updateRupStatusAndContent(status, onRequested, onSuccess, onFailed);
  }

  onSubmitClicked = () => {
    const {
      plan,
      references,
      updatePlan,
      updateGrazingSchedule,
      // toastSuccessMessage,
    } = this.props;
    const planStatus = references[REFERENCE_KEY.PLAN_STATUS];
    const status = planStatus.find(s => s.name === PLAN_STATUS.PENDING);

    const onRequested = () => {
      this.setState({ isSubmitting: true });
    };

    const onSuccess = (newSchedules) => {
      // generate a list of schedule ids
      const grazingSchedules = newSchedules.map((grazingSchedule) => {
        updateGrazingSchedule({ grazingSchedule });
        return grazingSchedule.id;
      });
      // update schedules in Redux store
      const newPlan = { ...plan, status, grazingSchedules };
      updatePlan({ plan: newPlan });
      this.setState({
        isSubmitModalOpen: false,
        isSubmitting: false,
      });
      // toastSuccessMessage(SUBMIT_PLAN_SUCCESS);
    };

    const onFailed = () => {
      this.setState({
        isSubmitting: false,
        isSubmitModalOpen: false,
      });
    };

    this.updateRupStatusAndContent(status, onRequested, onSuccess, onFailed);
  }

  updateRupStatusAndContent = (status, onRequested, onSuccess, onFailed) => {
    const {
      plan,
      updatePlanStatus,
      createOrUpdateRupSchedule,
      grazingSchedulesMap,
      // toastErrorMessage,
    } = this.props;

    onRequested();

    const error = this.validateRup(plan);

    if (error) {
      onFailed();
    } else {
      const planId = plan && plan.id;
      const statusId = status && status.id;
      const grazingSchedules = plan && plan.grazingSchedules
      && plan.grazingSchedules.map(id => grazingSchedulesMap[id]);

      if (planId && statusId && grazingSchedules) {
        const makeRequest = async () => {
          try {
            await updatePlanStatus(planId, statusId, false);
            const newSchedules = await Promise.all(grazingSchedules.map(schedule => (
              createOrUpdateRupSchedule(planId, schedule)
            )));
            onSuccess(newSchedules);
          } catch (err) {
            onFailed();
            // toastErrorMessage(err);
            throw err;
          }
        };
        makeRequest();
      }
    }
  }

  validateRup = (plan) => {
    const {
      references,
      agreement,
      pasturesMap,
      grazingSchedulesMap,
    } = this.props;
    const usages = agreement && agreement.usage;
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];
    const errors = utils.handleRupValidation(plan, pasturesMap, grazingSchedulesMap, livestockTypes, usages);

    // errors have been found
    if (errors.length !== 0) {
      const [error] = errors;
      document.getElementById(error.elementId).scrollIntoView({
        behavior: 'smooth',
      });
      return error;
    }

    // no errors found
    return false;
  }

  submitConfirmModalClose = () => this.setState({ isSubmitModalOpen: false })
  submitConfirmModalOpen = () => {
    const error = this.validateRup(this.props.plan);
    if (!error) {
      this.setState({ isSubmitModalOpen: true });
    }
  }

  render() {
    const {
      isSavingAsDraft,
      isSubmitting,
      isSubmitModalOpen,
    } = this.state;

    const {
      plan,
      user,
      agreement,
      references,
      pasturesMap,
      grazingSchedulesMap,
      ministerIssuesMap,
    } = this.props;

    const { agreementId, status } = plan;
    const { clients, usage: usages } = agreement;
    const zone = agreement && agreement.zone;
    const { primaryAgreementHolder } = utils.getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;

    const isEditable = utils.isStatusCreated(status)
      || utils.isStatusDraft(status) || utils.isStatusChangedRequested(status);

    return (
      <article className="rup">
        <ConfirmationModal
          open={isSubmitModalOpen}
          header={SUBMIT_RUP_CHANGE_FOR_AH_HEADER}
          content={SUBMIT_RUP_CHANGE_FOR_AH_CONTENT}
          onNoClicked={this.submitConfirmModalClose}
          onYesClicked={this.onSubmitClicked}
          loading={isSubmitting}
        />

        <Banner
          className="banner__no-default-height"
          header={agreementId}
          content={utils.getBannerContentForAH(status)}
        />

        <div
          id={ELEMENT_ID.RUP_STICKY_HEADER}
          className="rup__sticky"
        >
          <div className="rup__sticky__container">
            <div className="rup__sticky__left">
              <div className="rup__sticky__title">{agreementId}</div>
              <div className="rup__sticky__primary-agreement-holder">{primaryAgreementHolderName}</div>
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
                onClick={this.submitConfirmModalOpen}
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
            pasturesMap={pasturesMap}
          />

          {isEditable &&
            <EditRupGrazingSchedules
              references={references}
              usages={usages}
              plan={plan}
              pasturesMap={pasturesMap}
              grazingSchedulesMap={grazingSchedulesMap}
            />
          }
          {!isEditable &&
            <RupGrazingSchedules
              className="rup__schedules__container"
              references={references}
              usages={usages}
              plan={plan}
              pasturesMap={pasturesMap}
              grazingSchedulesMap={grazingSchedulesMap}
            />
          }

          <RupMinisterIssues
            className="rup__missues__container"
            references={references}
            plan={plan}
            pasturesMap={pasturesMap}
            ministerIssuesMap={ministerIssuesMap}
          />
        </div>
      </article>
    );
  }
}

RupAH.propTypes = propTypes;
export default RupAH;
