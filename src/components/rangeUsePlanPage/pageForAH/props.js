import PropTypes from 'prop-types';

export const propTypes = {
  agreement: PropTypes.shape({ plan: PropTypes.object }),
  plan: PropTypes.shape({}),
  user: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  schedulesMap: PropTypes.shape({}).isRequired,
  ministerIssuesMap: PropTypes.shape({}).isRequired,
  planStatusHistoryMap: PropTypes.shape({}).isRequired,
  additionalRequirementsMap: PropTypes.shape({}).isRequired,
  managementConsiderationsMap: PropTypes.shape({}).isRequired,
  updateRUPStatus: PropTypes.func.isRequired,
  createOrUpdateRUPGrazingSchedule: PropTypes.func.isRequired,
  createOrUpdateRUPMinisterIssueAndActions: PropTypes.func.isRequired,
  toastSuccessMessage: PropTypes.func.isRequired,
  toastErrorMessage: PropTypes.func.isRequired,
  createAmendment: PropTypes.func.isRequired,
  isCreatingAmendment: PropTypes.bool.isRequired,
  openConfirmationModal: PropTypes.func.isRequired,
  fetchPlan: PropTypes.func.isRequired,
  createOrUpdateRUPInvasivePlantChecklist: PropTypes.func.isRequired,
  createOrUpdateRUPManagementConsideration: PropTypes.func.isRequired,
};

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
