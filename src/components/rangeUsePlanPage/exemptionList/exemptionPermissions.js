import { EXEMPTION_STATUS } from '../../../constants/variables';
import { isUserAdmin, isUserAgrologist, isUserDecisionMaker } from '../../../utils/helper/user';

const APPROVE_OR_REJECTABLE_STATUSES = [EXEMPTION_STATUS.PENDING_APPROVAL, EXEMPTION_STATUS.IN_PROGRESS];
const STAFF_EDITABLE_STATUSES = [EXEMPTION_STATUS.DRAFT, EXEMPTION_STATUS.IN_PROGRESS, EXEMPTION_STATUS.REJECTED];
const ADMIN_OR_DM_EDITABLE_STATUSES = [
  EXEMPTION_STATUS.PENDING_APPROVAL,
  EXEMPTION_STATUS.IN_PROGRESS,
  EXEMPTION_STATUS.REJECTED,
];

export const getExemptionActionPermissions = (user, exemptionStatus) => {
  const isAdminOrDecisionMaker = isUserAdmin(user) || isUserDecisionMaker(user);
  const isStaffAgrologist = isUserAgrologist(user);

  const canApproveReject = isAdminOrDecisionMaker && APPROVE_OR_REJECTABLE_STATUSES.includes(exemptionStatus);
  const canCancel = isAdminOrDecisionMaker && exemptionStatus !== EXEMPTION_STATUS.CANCELLED;
  const canEdit =
    (isStaffAgrologist && STAFF_EDITABLE_STATUSES.includes(exemptionStatus)) ||
    (isAdminOrDecisionMaker && ADMIN_OR_DM_EDITABLE_STATUSES.includes(exemptionStatus));

  return {
    canApproveReject,
    canCancel,
    canEdit,
    canView: true,
  };
};
