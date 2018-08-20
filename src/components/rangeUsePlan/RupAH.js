import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Status, Banner } from '../common';
import RupBasicInformation from './view/RupBasicInformation';
import RupPastures from './view/RupPastures';
import RupGrazingSchedules from './view/RupGrazingSchedules';
import RupMinisterIssues from './view/RupMinisterIssues';
import EditRupGrazingSchedules from './edit/EditRupGrazingSchedules';
import AmendmentSubmissionModal from './AmendmentSubmissionModal';
import { ELEMENT_ID, PLAN_STATUS, REFERENCE_KEY, CONFIRMATION_MODAL_ID } from '../../constants/variables';
import { RANGE_USE_PLAN, EXPORT_PDF } from '../../constants/routes';
import * as strings from '../../constants/strings';
import * as utils from '../../utils';
import { isPlanAmendment } from '../../utils';

const propTypes = {
  agreement: PropTypes.shape({ plan: PropTypes.object }),
  plan: PropTypes.shape({}),
  user: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  ministerIssuesMap: PropTypes.shape({}).isRequired,
  updateRUPStatus: PropTypes.func.isRequired,
  createOrUpdateRupGrazingSchedule: PropTypes.func.isRequired,
  toastSuccessMessage: PropTypes.func.isRequired,
  toastErrorMessage: PropTypes.func.isRequired,
  createAmendment: PropTypes.func.isRequired,
  isCreatingAmendment: PropTypes.bool.isRequired,
  planUpdated: PropTypes.func.isRequired,
  openConfirmationModal: PropTypes.func.isRequired,
  closeConfirmationModal: PropTypes.func.isRequired,
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
      plan,
      planUpdated,
      references,
      toastSuccessMessage,
    } = this.props;
    const planStatus = references[REFERENCE_KEY.PLAN_STATUS];
    const status = planStatus.find(s => s.code === PLAN_STATUS.DRAFT);
    const onRequested = () => {
      this.setState({ isSavingAsDraft: false });
    };
    const onSuccess = () => {
      // update schedules in Redux store
      const newPlan = { ...plan, status };
      planUpdated({ plan: newPlan });
      this.setState({ isSavingAsDraft: false });
      toastSuccessMessage(strings.SAVE_PLAN_AS_DRAFT_SUCCESS);
    };
    const onError = () => {
      this.setState({ isSavingAsDraft: false });
    };

    this.updateRupStatusAndContent(status, onRequested, onSuccess, onError);
  }

  onSubmitClicked = () => {
    const {
      plan,
      planUpdated,
      references,
      toastSuccessMessage,
      closeConfirmationModal,
    } = this.props;
    const planStatus = references[REFERENCE_KEY.PLAN_STATUS];
    const status = planStatus.find(s => s.code === PLAN_STATUS.PENDING);

    const onRequested = () => {
      this.setState({ isSubmitting: true });
    };

    const onSuccess = () => {
      // update the status and schedules of the plan in Redux store
      const newPlan = { ...plan, status };
      planUpdated({ plan: newPlan });
      this.setState({ isSubmitting: false });
      toastSuccessMessage(strings.SUBMIT_PLAN_SUCCESS);
    };

    const onError = () => {
      this.setState({ isSubmitting: false });
    };
    closeConfirmationModal({ modalId: CONFIRMATION_MODAL_ID.SUBMIT_PLAN });
    this.updateRupStatusAndContent(status, onRequested, onSuccess, onError);
  }

  updateRupStatusAndContent = async (status, onRequested, onSuccess, onError) => {
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
      onError();
      return;
    }
    const planId = plan && plan.id;
    const statusId = status && status.id;
    const grazingSchedules = plan && plan.grazingSchedules
    && plan.grazingSchedules.map(id => grazingSchedulesMap[id]);

    try {
      await updateRUPStatus(planId, statusId, false);
      const newSchedules = await Promise.all(grazingSchedules.map(schedule => (
        createOrUpdateRupGrazingSchedule(planId, schedule)
      )));
      onSuccess(newSchedules);
    } catch (err) {
      onError();
      toastErrorMessage(err);
      throw err;
    }
  }

  onAmendPlanClicked = () => {
    const {
      plan,
      agreement,
      createAmendment,
      history,
    } = this.props;

    createAmendment(plan).then((amendment) => {
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
    const { id: planId, agreementId } = this.props.plan || {};
    window.open(`${EXPORT_PDF}/${agreementId}/${planId}`, '_blank');
  }

  openSubmitConfirmModal = () => {
    const { plan, openConfirmationModal } = this.props;
    const error = this.validateRup(plan);
    if (!error) {
      if (isPlanAmendment(plan)) {
        this.openSubmitAmendmentModal();
        return;
      }
      openConfirmationModal({
        modal: {
          id: CONFIRMATION_MODAL_ID.SUBMIT_PLAN,
          header: strings.SUBMIT_RUP_CHANGE_FOR_AH_HEADER,
          content: strings.SUBMIT_RUP_CHANGE_FOR_AH_CONTENT,
          onYesBtnClicked: this.onSubmitClicked,
        },
      });
    }
  }

  openSubmitAmendmentModal = () => this.setState({ isSubmitAmendmentModalOpen: true })
  closeSubmitAmendmentModal = () => this.setState({ isSubmitAmendmentModalOpen: false })

  render() {
    const {
      isSavingAsDraft,
      isSubmitting,
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
    const { primaryAgreementHolder } = utils.getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;

    const isEditable = utils.isStatusAllowingRevisionForAH(status);
    const isAmendable = utils.isStatusAmongApprovedStatuses(status);

    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    let header = `${agreementId} - Range Use Plan`;
    if (amendmentTypeId && amendmentTypes) {
      const amendmentType = amendmentTypes.find(at => at.id === amendmentTypeId);
      header = `${agreementId} - ${amendmentType.description}`;
    }

    return (
      <section className="rup">
        <AmendmentSubmissionModal
          open={isSubmitAmendmentModalOpen}
          onClose={this.closeSubmitAmendmentModal}
          plan={plan}
          clients={clients}
          updateRupStatusAndContent={this.updateRupStatusAndContent}
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
              >
                {strings.PREVIEW_PDF}
              </Button>
              { isEditable &&
                <Fragment>
                  <Button
                    loading={isSavingAsDraft}
                    onClick={this.onSaveDraftClick}
                    style={{ marginLeft: '10px' }}
                  >
                    {strings.SAVE_DRAFT}
                  </Button>
                  <Button
                    loading={isSubmitting}
                    onClick={this.openSubmitConfirmModal}
                    style={{ marginLeft: '10px' }}
                  >
                    {strings.SUBMIT_FOR_REVIEW}
                  </Button>
                </Fragment>
              }
              { isAmendable &&
                <Button
                  loading={isCreatingAmendment}
                  onClick={this.onAmendPlanClicked}
                  style={{ marginLeft: '10px' }}
                >
                  {strings.AMEND_PLAN}
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
            user={user}
          />

          <RupPastures
            className="rup__pastures__container"
            plan={plan}
            pasturesMap={pasturesMap}
          />

          {isEditable
            ? <EditRupGrazingSchedules
                className="rup__schedules__container"
                references={references}
                usages={usages}
                plan={plan}
                pasturesMap={pasturesMap}
                grazingSchedulesMap={grazingSchedulesMap}
              />
            : <RupGrazingSchedules
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
