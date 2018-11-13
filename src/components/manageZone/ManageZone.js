import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button } from 'semantic-ui-react';
import { Banner } from '../common';
import {
  MANAGE_ZONE_BANNER_CONTENT, MANAGE_ZONE_BANNER_HEADER,
  UPDATE_CONTACT_CONFIRMATION_CONTENT, UPDATE_CONTACT_CONFIRMATION_HEADER,
  NO_DESCRIPTION, NOT_ASSIGNED,
} from '../../constants/strings';
import { ELEMENT_ID, CONFIRMATION_MODAL_ID } from '../../constants/variables';
import { getUserFullName } from '../../utils';

export class ManageZone extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    zones: PropTypes.arrayOf(PropTypes.object).isRequired,
    zonesMap: PropTypes.shape({}).isRequired,
    zoneUpdated: PropTypes.func.isRequired,
    updateUserIdOfZone: PropTypes.func.isRequired,
    openConfirmationModal: PropTypes.func.isRequired,
    closeConfirmationModal: PropTypes.func.isRequired,
  };

  state = {
    newContactId: null,
    zoneId: null,
  }

  onZoneChanged = (e, { value: zoneId }) => {
    this.setState({
      zoneId,
    });
  }

  onContactChanged = (e, { value: newContactId }) => {
    this.setState({ newContactId });
  }

  assignStaffToZone = () => {
    const { zoneId, newContactId: userId } = this.state;
    const {
      zonesMap,
      updateUserIdOfZone,
      zoneUpdated,
      closeConfirmationModal,
    } = this.props;

    closeConfirmationModal({ modalId: CONFIRMATION_MODAL_ID.MANAGE_ZONE });

    const staffAssigned = (assignedUser) => {
      // create a new zone obj with the new assigned user
      const zone = {
        ...zonesMap[zoneId],
        user: assignedUser,
        userId: assignedUser.id,
      };

      // then update this zone in Redux store
      zoneUpdated(zone);

      // refresh the view
      this.setState({
        newContactId: null,
        zoneId: null,
      });
    };

    updateUserIdOfZone(zoneId, userId).then(staffAssigned);
  }

  openUpdateConfirmationModal = () => {
    this.props.openConfirmationModal({
      modal: {
        id: CONFIRMATION_MODAL_ID.MANAGE_ZONE,
        header: UPDATE_CONTACT_CONFIRMATION_HEADER,
        content: UPDATE_CONTACT_CONFIRMATION_CONTENT,
        onYesBtnClicked: this.assignStaffToZone,
      },
    });
  }

  render() {
    const {
      zoneId,
      newContactId,
    } = this.state;
    const { users, zones } = this.props;

    const zoneOptions = zones.map((zone) => {
      const {
        id: zoneId,
        code: zoneCode,
        user: staff,
        description: zoneDescription,
        district,
      } = zone;
      const option = {
        value: zoneId,
        text: zoneCode,
        description: NOT_ASSIGNED,
      };
      let description = zoneDescription;
      if (zoneDescription === 'Please update contact and description' || zoneDescription === 'Please update contact') {
        description = NO_DESCRIPTION;
      }
      option.text += `(${description})`;
      if (district) {
        option.text += ` - ${district.code}`;
      }
      if (staff) {
        option.description = getUserFullName(staff);
      }

      return option;
    });
    const contactOptions = users.map(user => (
      {
        value: user.id,
        description: user.email,
        text: getUserFullName(user),
      }
    ));
    const isUpdateBtnEnabled = newContactId && zoneId;

    return (
      <section className="manage-zone">
        <Banner
          header={MANAGE_ZONE_BANNER_HEADER}
          content={MANAGE_ZONE_BANNER_CONTENT}
        />

        <div className="manage-zone__content">
          <div className="manage-zone__steps">
            <h3>Step 1: Select a zone</h3>
            <div className="manage-zone__step-one">
              <Dropdown
                id={ELEMENT_ID.MANAGE_ZONE_ZONES_DROPDOWN}
                placeholder="Zone"
                options={zoneOptions}
                value={zoneId}
                onChange={this.onZoneChanged}
                fluid
                search
                selection
                clearable
              />
            </div>

            <h3>Step 2: Assign a new staff</h3>
            <div className="manage-zone__step-two">
              <Dropdown
                id={ELEMENT_ID.MANAGE_ZONE_CONTACTS_DROPDOWN}
                placeholder="Contact"
                options={contactOptions}
                value={newContactId}
                onChange={this.onContactChanged}
                fluid
                search
                selection
                clearable
              />
            </div>

            <div className="manage-zone__update-btn">
              <Button
                primary
                onClick={this.openUpdateConfirmationModal}
                disabled={!isUpdateBtnEnabled}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ManageZone;
