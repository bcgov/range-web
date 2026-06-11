export interface PageForAHProps {
  agreement: any;
  plan: any;
  user: any;
  references: any;
  history: any;
  pasturesMap: any;
  schedulesMap: any;
  ministerIssuesMap: any;
  planStatusHistoryMap: any;
  additionalRequirementsMap: any;
  managementConsiderationsMap: any;
  updateRUPStatus: (...args: any[]) => any;
  createOrUpdateRUPGrazingSchedule: (...args: any[]) => any;
  createOrUpdateRUPMinisterIssueAndActions: (...args: any[]) => any;
  toastSuccessMessage: (msg: any) => void;
  toastErrorMessage: (msg: any) => void;
  createAmendment: (...args: any[]) => any;
  isCreatingAmendment: boolean;
  openConfirmationModal: (config: any) => void;
  fetchPlan: () => Promise<any>;
  createOrUpdateRUPInvasivePlantChecklist: (...args: any[]) => any;
  createOrUpdateRUPManagementConsideration: (...args: any[]) => any;
  clientAgreements: any[] | null;
}

export const defaultProps = {
  agreement: {
    zone: {},
    usage: [],
  },
  plan: {
    agreementId: '',
    pastures: [],
    schedules: [],
    ministerIssues: [],
    confirmations: [],
    planStatusHistory: [],
    invasivePlantChecklist: {},
    managementConsiderations: [],
    additionalRequirements: [],
  },
};
