import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { isPlanAmendment, isStatusStands, isStatusPending, isStatusCreated } from '../../utils';
import { PLAN_STATUS, CONFIRMATION_MODAL_ID, REFERENCE_KEY } from '../../constants/variables';
import { getReferences } from '../../reducers/rootReducer';
import { openConfirmationModal, closeConfirmationModal, updatePlan } from '../../actions';
import { updateRUPStatus } from '../../actionCreators';
import * as strings from '../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  openConfirmationModal: PropTypes.func.isRequired,
  closeConfirmationModal: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
};

class UpdateStatusDropdown extends Component {
  openCompletedConfirmModal = () => {
    this.props.openConfirmationModal({
      modal: {
        id: CONFIRMATION_MODAL_ID.UPDATE_PLAN_STATUS,
        header: strings.COMPLETED_CONFIRMATION_HEADER,
        content: strings.COMPLETED_CONFIRMATION_CONTENT,
        onYesBtnClicked: () => this.updateStatus(PLAN_STATUS.COMPLETED),
      },
    });
  }

  openChangeRequestConfirmModal = () => {
    this.props.openConfirmationModal({
      modal: {
        id: CONFIRMATION_MODAL_ID.UPDATE_PLAN_STATUS,
        header: strings.CHANGE_REQUEST_CONFIRMATION_HEADER,
        content: strings.CHANGE_REQUEST_CONFIRMATION_CONTENT,
        onYesBtnClicked: () => this.updateStatus(PLAN_STATUS.CHANGE_REQUESTED),
      },
    });
  }

  openWMWEConfirmModal = () => {
    this.props.openConfirmationModal({
      modal: {
        id: CONFIRMATION_MODAL_ID.UPDATE_PLAN_STATUS,
        header: strings.WRONGLY_MADE_WITHOUT_EFFECT_CONFIRMATION_HEADER,
        content: strings.WRONGLY_MADE_WITHOUT_EFFECT_CONFIRMATION_CONTENT,
        onYesBtnClicked: () => this.updateStatus(PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT),
      },
    });
  }

  openSWMConfirmModal = () => {
    this.props.openConfirmationModal({
      modal: {
        id: CONFIRMATION_MODAL_ID.UPDATE_PLAN_STATUS,
        header: strings.STANDS_WRONGLY_MADE_CONFIRMATION_HEADER,
        content: strings.STANDS_WRONGLY_MADE_CONFIRMATION_CONTENT,
        onYesBtnClicked: () => this.updateStatus(PLAN_STATUS.STANDS_WRONGLY_MADE),
      },
    });
  }

  updateStatus = (statusCode) => {
    const {
      plan,
      references,
      updateRUPStatus,
      updatePlan,
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
        updatePlan({ plan: newPlan });
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
  updatePlan,
  openConfirmationModal,
  closeConfirmationModal,
  updateRUPStatus,
})(UpdateStatusDropdown);