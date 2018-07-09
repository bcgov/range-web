import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button } from 'semantic-ui-react';
import { Banner, ConfirmationModal } from '../common';
import {
  MANAGE_ZONE_BANNER_CONTENT, MANAGE_ZONE_BANNER_HEADER,
  UPDATE_CONTACT_CONFIRMATION_CONTENT, UPDATE_CONTACT_CONFIRMATION_HEADER,
  NOT_SELECTED, CONTACT_NO_EXIST,
} from '../../constants/strings';
import { ELEMENT_ID } from '../../constants/variables';
import { getUserFullName } from '../../utils';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  zones: PropTypes.arrayOf(PropTypes.object).isRequired,
  zonesMap: PropTypes.shape({}).isRequired,
  updateZone: PropTypes.func.isRequired,
  updateUserIdOfZone: PropTypes.func.isRequired,
  isAssigning: PropTypes.bool.isRequired,
};
/* eslint-disable arrow-body-style */
export class ManageZone extends Component {
  state = {
    newContactId: null,
    currContactName: null,
    zoneId: null,
    isUpdateModalOpen: false,
  }

  onZoneChanged = (e, { value: zoneId }) => {
    const zone = this.props.zonesMap[zoneId];
    const user = zone && zone.user;
    const currContactName = getUserFullName(user) || CONTACT_NO_EXIST;

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
    const { zonesMap, updateUserIdOfZone, updateZone } = this.props;

    const staffAssigned = (assignedUser) => {
      // create a new zone obj with the new assigned user
      const zone = {
        ...zonesMap[zoneId],
        user: assignedUser,
        userId: assignedUser.id,
      };
      // then update this zone in Redux store
      updateZone(zone);

      this.closeUpdateConfirmationModal();

      // refresh the view
      this.setState({
        newContactId: null,
        zoneId: null,
        currContactName: null,
      });
    };
    updateUserIdOfZone(zoneId, userId).then(staffAssigned);
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
      return {
        value: zone.id,
        text: zone.code,
      };
    });
    const contactOptions = users.map((user) => {
      return {
        value: user.id,
        description: user.email,
        text: getUserFullName(user),
      };
    });
    const isUpdateBtnEnabled = newContactId && zoneId;

    return (
      <section className="manage-zone">
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
                  id={ELEMENT_ID.MANAGE_ZONE_ZONES_DROPDOWN}
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
              <Dropdown
                id={ELEMENT_ID.MANAGE_ZONE_CONTACTS_DROPDOWN}
                placeholder="Contact"
                options={contactOptions}
                value={newContactId}
                onChange={this.onContactChanged}
                fluid
                search
                selection
              />
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
      </section>
    );
  }
}

ManageZone.propTypes = propTypes;
export default ManageZone;
