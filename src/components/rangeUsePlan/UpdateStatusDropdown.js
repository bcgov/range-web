import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { isPlanAmendment, isStatusStands, isStatusPending, isStatusCreated, isStatusCompleted } from '../../utils';
import { PLAN_STATUS, CONFIRMATION_MODAL_ID, REFERENCE_KEY } from '../../constants/variables';
import { getReferences } from '../../reducers/rootReducer';
import { openConfirmationModal, closeConfirmationModal, planUpdated } from '../../actions';
import { updateRUPStatus } from '../../actionCreators';
import * as strings from '../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  openConfirmationModal: PropTypes.func.isRequired,
  closeConfirmationModal: PropTypes.func.isRequired,
  planUpdated: PropTypes.func.isRequired,
};

class UpdateStatusDropdown extends Component {
  openConfirmationModalForUpdatingPlanStatus = ({ header, content, statusCode }) => {
    this.props.openConfirmationModal({
      modal: {
        id: CONFIRMATION_MODAL_ID.UPDATE_PLAN_STATUS,
        header,
        content,
        onYesBtnClicked: () => this.updateStatus(statusCode),
      },
    });
  }

  openCompletedConfirmModal = () => {
    this.openConfirmationModalForUpdatingPlanStatus({
      header: strings.COMPLETED_CONFIRMATION_HEADER,
      content: strings.COMPLETED_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.COMPLETED,
    });
  }

  openChangeRequestConfirmModal = () => {
    this.openConfirmationModalForUpdatingPlanStatus({
      header: strings.CHANGE_REQUEST_CONFIRMATION_HEADER,
      content: strings.CHANGE_REQUEST_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.CHANGE_REQUESTED,
    });
  }

  openWMWEConfirmModal = () => {
    this.openConfirmationModalForUpdatingPlanStatus({
      header: strings.WRONGLY_MADE_WITHOUT_EFFECT_CONFIRMATION_HEADER,
      content: strings.WRONGLY_MADE_WITHOUT_EFFECT_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT,
    });
  }

  openSWMConfirmModal = () => {
    this.openConfirmationModalForUpdatingPlanStatus({
      header: strings.STANDS_WRONGLY_MADE_CONFIRMATION_HEADER,
      content: strings.STANDS_WRONGLY_MADE_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.STANDS_WRONGLY_MADE,
    });
  }

  openApprovedConfirmModal = () => {
    this.openConfirmationModalForUpdatingPlanStatus({
      header: strings.APPROVED_CONFIRMATION_HEADER,
      content: strings.APPROVED_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.APPROVED,
    });
  }

  updateStatus = (statusCode) => {
    const {
      plan,
      references,
      updateRUPStatus,
      planUpdated,
      closeConfirmationModal,
    } = this.props;

    closeConfirmationModal({ modalId: CONFIRMATION_MODAL_ID.UPDATE_PLAN_STATUS });

    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS] || [];
    const status = planStatuses.find(s => s.code === statusCode);
    if (status && plan) {
      const statusUpdated = (newStatus) => {
        const newPlan = {
          ...plan,
          status: newStatus,
        };
        planUpdated({ plan: newPlan });
      };
      updateRUPStatus(plan.id, status.id).then(statusUpdated);
    }
  }

  render() {
    const { plan } = this.props;
    const status = plan && plan.status;

    let statusDropdownOptions = [];
    if (isPlanAmendment(plan)) {
      if (isStatusStands(status)) {
        statusDropdownOptions = [
          {
            key: PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT,
            text: 'Wrongly Made - Without Effect',
            onClick: this.openWMWEConfirmModal,
          },
          {
            key: PLAN_STATUS.STANDS_WRONGLY_MADE,
            text: 'Stands - Wrongly Made',
            onClick: this.openSWMConfirmModal,
          },
        ];
      }
    } else { // for initial plan
      if (isStatusPending(status) || isStatusCreated(status)) {
        statusDropdownOptions = [
          {
            key: PLAN_STATUS.COMPLETED,
            text: 'Completed',
            onClick: this.openCompletedConfirmModal,
          },
          {
            key: PLAN_STATUS.CHANGE_REQUESTED,
            text: 'Change Request',
            onClick: this.openChangeRequestConfirmModal,
          },
        ];
      }
      if (isStatusCompleted(status)) {
        statusDropdownOptions = [
          {
            key: PLAN_STATUS.APPROVED,
            text: 'Approved',
            onClick: this.openApprovedConfirmModal,
          },
        ];
      }
    }
    return (
      <Dropdown
        text={strings.UPDATE_STATUS}
        options={statusDropdownOptions}
        disabled={statusDropdownOptions.length === 0}
        style={{ marginLeft: '10px' }}
        button
        item
      />
    );
  }
}


const mapStateToProps = state => (
  {
    references: getReferences(state),
  }
);

UpdateStatusDropdown.propTypes = propTypes;
export default connect(mapStateToProps, {
  planUpdated,
  openConfirmationModal,
  closeConfirmationModal,
  updateRUPStatus,
})(UpdateStatusDropdown);