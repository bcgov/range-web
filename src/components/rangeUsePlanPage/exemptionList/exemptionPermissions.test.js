/* eslint-env jest */
import { EXEMPTION_STATUS } from '../../../constants/variables';
import { getExemptionActionPermissions } from './exemptionPermissions';

const adminUser = { roleId: 1 };
const decisionMakerUser = { roleId: 2 };
const staffAgrologistUser = { roleId: 3 };
const agreementHolderUser = { roleId: 4 };

describe('getExemptionActionPermissions', () => {
  it('allows staff agrologist to edit in-progress exemptions and blocks approve/reject/cancel', () => {
    const permissions = getExemptionActionPermissions(staffAgrologistUser, EXEMPTION_STATUS.IN_PROGRESS);

    expect(permissions).toEqual({
      canApproveReject: false,
      canCancel: false,
      canEdit: true,
      canView: true,
    });
  });

  it('forces view-only for staff agrologist on pending approval exemptions', () => {
    const permissions = getExemptionActionPermissions(staffAgrologistUser, EXEMPTION_STATUS.PENDING_APPROVAL);

    expect(permissions).toEqual({
      canApproveReject: false,
      canCancel: false,
      canEdit: false,
      canView: true,
    });
  });

  it('allows admin and decision maker to approve/reject pending exemptions', () => {
    const adminPermissions = getExemptionActionPermissions(adminUser, EXEMPTION_STATUS.PENDING_APPROVAL);
    const decisionMakerPermissions = getExemptionActionPermissions(
      decisionMakerUser,
      EXEMPTION_STATUS.PENDING_APPROVAL,
    );

    expect(adminPermissions.canApproveReject).toBe(true);
    expect(decisionMakerPermissions.canApproveReject).toBe(true);
    expect(adminPermissions.canCancel).toBe(true);
    expect(decisionMakerPermissions.canCancel).toBe(true);
  });

  it('keeps agreement holder in view-only mode', () => {
    const permissions = getExemptionActionPermissions(agreementHolderUser, EXEMPTION_STATUS.REJECTED);

    expect(permissions).toEqual({
      canApproveReject: false,
      canCancel: false,
      canEdit: false,
      canView: true,
    });
  });
});
