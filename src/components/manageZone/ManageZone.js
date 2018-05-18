import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button } from 'semantic-ui-react';
import { Banner, ConfirmationModal } from '../common';
import {
  MANAGE_ZONE_BANNER_CONTENT, MANAGE_ZONE_BANNER_HEADER,
  UPDATE_CONTACT_CONFIRMATION_CONTENT, UPDATE_CONTACT_CONFIRMATION_HEADER,
  NOT_SELECTED, CONTACT_NO_EXIST,
} from '../../constants/strings';
import User from '../../models/User';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  zones: PropTypes.arrayOf(PropTypes.object).isRequired,
  staffAssignedToZone: PropTypes.func.isRequired,
  assignStaffToZone: PropTypes.func.isRequired,
  isAssigning: PropTypes.bool.isRequired,
};

export class ManageZone extends Component {
  state = {
    newContactId: null,
    currContactName: null,
    zoneId: null,
    isUpdateModalOpen: false,
  }

  onZoneChanged = (e, { value: zoneId }) => {
    const zone = this.props.zones.find(z => z.id === zoneId);
    const user = new User(zone && zone.user);
    const currContactName = user.fullName || CONTACT_NO_EXIST;

    this.setState({
      zoneId,
      currContactName,
    });
  }

  onContactChanged = (e, { value: newContactId }) => {
    this.setState({ newContactId });
  }

  closeUpdateConfirmationModal = () => {
    this.setState({ isUpdateModalOpen: false });
  }

  openUpdateConfirmationModal = () => {
    this.setState({ isUpdateModalOpen: true });
  }

  assignStaffToZone = () => {
    const { zoneId, newContactId: userId } = this.state;
    const { zones, assignStaffToZone, staffAssignedToZone } = this.props;

    const staffAssigned = (assignedUser) => {
      // update zones in Redux state
      staffAssignedToZone({ zones, zoneId, assignedUser });
      this.closeUpdateConfirmationModal();
      this.setState({
        newContactId: null,
        zoneId: null,
        currContactName: null,
      });
    };
    assignStaffToZone({ zoneId, userId }).then(staffAssigned);
  }

  render() {
    const {
      zoneId,
      isUpdateModalOpen,
      currContactName,
      newContactId,
    } = this.state;
    const { users, zones, isAssigning } = this.props;

    const zoneOptions = zones.map((zone) => {
      const { id, code } = zone;
      return {
        value: id,
        text: code,
      };
    });
    const contactOptions = users.map((u) => {
      const user = new User(u);
      const { id, fullName } = user;
      return {
        value: id,
        text: fullName,
      };
    });
    const isUpdateBtnEnabled = newContactId && zoneId;

    return (
      <div className="manage-zone">
        <ConfirmationModal
          open={isUpdateModalOpen}
          loading={isAssigning}
          header={UPDATE_CONTACT_CONFIRMATION_HEADER}
          content={UPDATE_CONTACT_CONFIRMATION_CONTENT}
          onNoClicked={this.closeUpdateConfirmationModal}
          onYesClicked={this.assignStaffToZone}
        />

        <Banner
          header={MANAGE_ZONE_BANNER_HEADER}
          content={MANAGE_ZONE_BANNER_CONTENT}
        />

        <div className="manage-zone__content">
          <div className="manage-zone__steps">
            <h3>Step 1: Select a zone</h3>
            <div className="manage-zone__step-one">
              <div className="manage-zone__dropdown">
                <Dropdown
                  id="manage-zone__zone-dropdown"
                  placeholder="Zone"
                  options={zoneOptions}
                  value={zoneId}
                  onChange={this.onZoneChanged}
                  fluid
                  search
                  selection
                />
              </div>
              <div className="manage-zone__text-field">
                <div className="manage-zone__text-field__title">Assigned Zone Contact</div>
                <div className="manage-zone__text-field__content">{currContactName || NOT_SELECTED}</div>
              </div>
            </div>

            <h3>Step 2: Assign a new contact</h3>
            <div className="manage-zone__step-two">
              <div className="manage-zone__dropdown">
                <Dropdown
                  id="manage-zone__contact-dropdown"
                  placeholder="Contact"
                  options={contactOptions}
                  value={newContactId}
                  onChange={this.onContactChanged}
                  fluid
                  search
                  selection
                />
              </div>
            </div>

            <div className="manage-zone__update-btn">
              <Button
                primary
                onClick={this.openUpdateConfirmationModal}
                disabled={!isUpdateBtnEnabled}
              >
                Update Zone
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ManageZone.propTypes = propTypes;
export default ManageZone;
