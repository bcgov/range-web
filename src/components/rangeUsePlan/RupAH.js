import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Status, ConfirmationModal, Banner } from '../common';
import RupBasicInformation from './view/RupBasicInformation';
import RupPastures from './view/RupPastures';
import RupGrazingSchedules from './view/RupGrazingSchedules';
import RupMinisterIssues from './view/RupMinisterIssues';
import EditRupGrazingSchedules from './edit/EditRupGrazingSchedules';
import AmendmentSubmissionModal from './AmendmentSubmissionModal';
import { ELEMENT_ID, PLAN_STATUS, REFERENCE_KEY, AMENDMENT_TYPE } from '../../constants/variables';
import { RANGE_USE_PLAN, EXPORT_PDF } from '../../constants/routes';
import * as strings from '../../constants/strings';
import * as utils from '../../utils';

const propTypes = {
  agreement: PropTypes.shape({ plan: PropTypes.object }),
  plan: PropTypes.shape({}),
  user: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  ministerIssuesMap: PropTypes.shape({}).isRequired,
  fetchPlan: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
  updateRUPStatus: PropTypes.func.isRequired,
  createOrUpdateRupGrazingSchedule: PropTypes.func.isRequired,
  updateGrazingSchedule: PropTypes.func.isRequired,
  toastSuccessMessage: PropTypes.func.isRequired,
  toastErrorMessage: PropTypes.func.isRequired,
  createAmendment: PropTypes.func.isRequired,
  isCreatingAmendment: PropTypes.bool.isRequired,
  history: PropTypes.shape({}).isRequired,
};
const defaultProps = {
  agreement: {
    zone: {},
    usage: [],
  },
  plan: {
    agreementId: '',
    pastures: [],
    grazingSchedules: [],
    ministerIssues: [],
  },
};

export class RupAH extends Component {
  state = {
    isSubmitPlanModalOpen: false,
    isSubmitAmendmentModalOpen: false,
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
      // plan,
      references,
      // updatePlan,
      // updateGrazingSchedule,
      toastSuccessMessage,
      fetchPlan,
    } = this.props;
    const planStatus = references[REFERENCE_KEY.PLAN_STATUS];
    const status = planStatus.find(s => s.code === PLAN_STATUS.DRAFT);
    const onRequested = () => {
      this.setState({ isSavingAsDraft: false });
    };
    const onSuccess = () => {
      fetchPlan();
      // generate a list of schedule ids
      // const grazingSchedules = newSchedules.map((grazingSchedule) => {
      //   updateGrazingSchedule({ grazingSchedule });
      //   return grazingSchedule.id;
      // });
      // update schedules in Redux store
      // const newPlan = { ...plan, status, grazingSchedules };
      // updatePlan({ plan: newPlan });
      this.setState({ isSavingAsDraft: false });
      toastSuccessMessage(strings.SAVE_PLAN_AS_DRAFT_SUCCESS);
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
      toastSuccessMessage,
    } = this.props;
    const planStatus = references[REFERENCE_KEY.PLAN_STATUS];
    const status = planStatus.find(s => s.code === PLAN_STATUS.PENDING);

    const onRequested = () => {
      this.setState({ isSubmitting: true });
    };

    const onSuccess = (newSchedules) => {
      // generate a list of schedule ids
      const grazingSchedules = newSchedules.map((grazingSchedule) => {
        updateGrazingSchedule({ grazingSchedule });
        return grazingSchedule.id;
      });
      // update the status and schedules of the plan in Redux store
      const newPlan = { ...plan, status, grazingSchedules };
      updatePlan({ plan: newPlan });
      this.setState({ isSubmitPlanModalOpen: false, isSubmitting: false });
      toastSuccessMessage(strings.SUBMIT_PLAN_SUCCESS);
    };

    const onFailed = () => {
      this.setState({ isSubmitting: false, isSubmitPlanModalOpen: false });
    };

    this.updateRupStatusAndContent(status, onRequested, onSuccess, onFailed);
  }

  updateRupStatusAndContent = (status, onRequested, onSuccess, onFailed) => {
    const {
      plan,
      updateRUPStatus,
      createOrUpdateRupGrazingSchedule,
      grazingSchedulesMap,
      toastErrorMessage,
    } = this.props;

    onRequested();

    const error = this.validateRup(plan);

    if (error) {
      onFailed();
      return;
    }
    const planId = plan && plan.id;
    const statusId = status && status.id;
    const grazingSchedules = plan && plan.grazingSchedules
    && plan.grazingSchedules.map(id => grazingSchedulesMap[id]);

    if (planId && statusId && grazingSchedules) {
      const makeRequest = async () => {
        try {
          await updateRUPStatus(planId, statusId, false);
          const newSchedules = await Promise.all(grazingSchedules.map(schedule => (
            createOrUpdateRupGrazingSchedule(planId, schedule)
          )));
          onSuccess(newSchedules);
        } catch (err) {
          onFailed();
          toastErrorMessage(err);
          throw err;
        }
      };
      makeRequest();
    }
  }

  onAmendPlanClicked = () => {
    const {
      plan,
      agreement,
      references,
      createAmendment,
      history,
    } = this.props;

    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS];
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const createdStatus = planStatuses.find(s => s.code === PLAN_STATUS.CREATED);
    const initialAmendment = amendmentTypes.find(at => at.code === AMENDMENT_TYPE.INITIAL);

    const newPlan = {
      ...plan,
      statusId: createdStatus.id,
      uploaded: false, // still need to create things like pastures and schedules
      amendmentTypeId: initialAmendment.id,
    };
    delete newPlan.id;

    createAmendment(newPlan).then((amendment) => {
      history.push(`${RANGE_USE_PLAN}/${agreement.id}/${amendment.id}`);
    });
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

  onViewPDFClicked = () => {
    const { id, agreementId } = this.props.plan || {};
    if (id && agreementId) {
      this.pdfLink.click();
    }
  }

  setPDFRef = (ref) => { this.pdfLink = ref; }

  closeSubmitConfirmModal = () => this.setState({ isSubmitPlanModalOpen: false })
  openSubmitConfirmModal = () => {
    const { plan } = this.props;
    const error = this.validateRup(plan);
    if (!error) {
      if (plan.amendmentTypeId) {
        this.openSubmitAmendmentModal();
        return;
      }
      this.setState({ isSubmitPlanModalOpen: true });
    }
  }

  openSubmitAmendmentModal = () => this.setState({ isSubmitAmendmentModalOpen: true })
  closeSubmitAmendmentModal = () => this.setState({ isSubmitAmendmentModalOpen: false })

  render() {
    const {
      isSavingAsDraft,
      isSubmitting,
      isSubmitPlanModalOpen,
      isSubmitAmendmentModalOpen,
    } = this.state;

    const {
      plan,
      user,
      agreement,
      references,
      pasturesMap,
      grazingSchedulesMap,
      ministerIssuesMap,
      isCreatingAmendment,
    } = this.props;

    const { agreementId, status, amendmentTypeId } = plan;
    const { clients, usage: usages } = agreement;
    const zone = agreement && agreement.zone;
    const { primaryAgreementHolder } = utils.getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;

    const isEditable = utils.isStatusCreated(status)
      || utils.isStatusDraft(status) || utils.isStatusChangedRequested(status);
    const isAmendable = utils.isStatusApproved(status);

    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    let header = `${agreementId} - Range Use Plan`;
    if (amendmentTypeId && amendmentTypes) {
      const amendmentType = amendmentTypes.find(at => at.id === amendmentTypeId);
      header = `${agreementId} - ${amendmentType.description}`;
    }

    return (
      <section className="rup">
        <a
          className="rup__pdf-link"
          target="_blank"
          href={`${EXPORT_PDF}/${agreementId}/${plan.id}`}
          ref={this.setPDFRef}
        >
          pdf link
        </a>

        <ConfirmationModal
          open={isSubmitPlanModalOpen}
          header={strings.SUBMIT_RUP_CHANGE_FOR_AH_HEADER}
          content={strings.SUBMIT_RUP_CHANGE_FOR_AH_CONTENT}
          onNoClicked={this.closeSubmitConfirmModal}
          onYesClicked={this.onSubmitClicked}
          loading={isSubmitting}
        />

        <AmendmentSubmissionModal
          open={isSubmitAmendmentModalOpen}
          onClose={this.closeSubmitAmendmentModal}
          plan={plan}
        />

        <Banner
          noDefaultHeight
          header={header}
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
                onClick={this.onViewPDFClicked}
                style={{ marginRight: '10px' }}
              >
                View PDF
              </Button>
              { isEditable &&
                <Fragment>
                  <Button
                    loading={isSavingAsDraft}
                    onClick={this.onSaveDraftClick}
                    style={{ marginRight: '10px' }}
                  >
                    Save Draft
                  </Button>
                  <Button
                    loading={isSubmitting}
                    onClick={this.openSubmitConfirmModal}
                  >
                    Submit for Review
                  </Button>
                </Fragment>
              }
              { isAmendable &&
                <Button
                  loading={isCreatingAmendment}
                  onClick={this.onAmendPlanClicked}
                >
                  Amend Plan
                </Button>
              }
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
      </section>
    );
  }
}

RupAH.propTypes = propTypes;
RupAH.defaultProps = defaultProps;
export default RupAH;
