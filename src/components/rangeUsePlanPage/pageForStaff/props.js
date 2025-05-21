import PropTypes from 'prop-types';

export const propTypes = {
  agreement: PropTypes.shape({ zone: PropTypes.object }),
  plan: PropTypes.shape({}),
  user: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  schedulesMap: PropTypes.shape({}).isRequired,
  ministerIssuesMap: PropTypes.shape({}).isRequired,
  planStatusHistoryMap: PropTypes.shape({}).isRequired,
  additionalRequirementsMap: PropTypes.shape({}).isRequired,
  managementConsiderationsMap: PropTypes.shape({}).isRequired,
  fetchPlan: PropTypes.func.isRequired,
  isFetchingPlan: PropTypes.bool.isRequired,
  updateRUP: PropTypes.func.isRequired,
  createOrUpdateRUPGrazingSchedule: PropTypes.func.isRequired,
};

export { defaultProps } from '../pageForAH/props';
