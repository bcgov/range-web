import * as strings from '../../constants/strings';
import * as planStatusValidation from '../validation/planStatus';

export const getBannerContentForAH = (status) => {
  if (planStatusValidation.isStatusCreated(status)) {
    return strings.RUP_CREATED_FOR_AH_CONTENT;
  }
  if (planStatusValidation.isStatusDraft(status)) {
    return strings.RUP_IN_DRAFT_FOR_AH_CONTENT;
  }
  if (planStatusValidation.isStatusPending(status)) {
    return strings.RUP_PENDING_FOR_AH_CONTENT;
  }
  if (planStatusValidation.isStatusChangedRequested(status)) {
    return strings.RUP_CHANGE_REQUESTED_FOR_AH_CONTENT;
  }
  if (planStatusValidation.isStatusCompleted(status)) {
    return strings.RUP_COMPLETE_FOR_AH_CONTENT;
  }
  if (planStatusValidation.isStatusApproved(status)) {
    return strings.RUP_APPROVED_FOR_AH_CONTENT;
  }
  if (planStatusValidation.isStatusNotApproved(status)) {
    return strings.RUP_NOT_APPROVED_FOR_AH_CONTENT;
  }
  if (planStatusValidation.isStatusNotApprovedFWR(status)) {
    return strings.RUP_NOT_APPROVED_FURTHER_WORK_REQUIRED_FOR_AH_CONTENT;
  }
  if (planStatusValidation.isStatusStands(status)) {
    return strings.RUP_STANDS_FOR_AH_CONTENT;
  }
  if (planStatusValidation.isStatusStandsWM(status)) {
    return strings.RUP_STANDS_WRONGLY_MADE_AH_CONTENT;
  }
  if (planStatusValidation.isStatusWronglyMakeWE(status)) {
    return strings.RUP_WRONGLY_MADE_WITHOUT_EFFECT;
  }
  return 'View Range Use Plan.';
};

export const getRUPViewHeader = (plan = {}, amendmentTypes) => {
  const { agreementId, amendmentTypeId } = plan;
  if (agreementId) {
    let header = `${agreementId} - Range Use Plan`;
    if (amendmentTypeId) {
      const amendmentType = amendmentTypes.find(at => at.id === amendmentTypeId);
      header = `${agreementId} - ${amendmentType.description}`;
    }
    return header;
  }

  return 'Range Use Plan';
};
