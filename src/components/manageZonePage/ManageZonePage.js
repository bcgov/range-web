import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { Banner, PrimaryButton, ErrorMessage } from '../common';
import {
  MANAGE_ZONE_BANNER_CONTENT, MANAGE_ZONE_BANNER_HEADER,
  UPDATE_CONTACT_CONFIRM_CONTENT, UPDATE_CONTACT_CONFIRM_HEADER, GET_ZONES_ERROR,
} from '../../constants/strings';
import { ELEMENT_ID, CONFIRMATION_MODAL_ID } from '../../constants/variables';
import { getZoneOption, getContactOption } from '../../utils';

export class ManageZonePage extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    zones: PropTypes.arrayOf(PropTypes.object).isRequired,
    zonesMap: PropTypes.shape({}).isRequired,
    errorOccuredGettingZones: PropTypes.bool.isRequired,
    zoneUpdated: PropTypes.func.isRequired,
    updateUserIdOfZone: PropTypes.func.isRequired,
    isAssigning: PropTypes.bool.isRequired,
    openConfirmationModal: PropTypes.func.isRequired,
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
    } = this.props;

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
      id: CONFIRMATION_MODAL_ID.MANAGE_ZONE,
      header: UPDATE_CONTACT_CONFIRM_HEADER,
      content: UPDATE_CONTACT_CONFIRM_CONTENT,
      onYesBtnClicked: this.assignStaffToZone,
      closeAfterYesBtnClicked: true,
    });
  }

  render() {
    const { zoneId, newContactId } = this.state;
    const { users, zones, isAssigning, errorOccuredGettingZones } = this.props;

    const zoneOptions = zones.map(zone => getZoneOption(zone));
    const contactOptions = users.map(user => getContactOption(user));
    const isUpdateBtnEnabled = newContactId && zoneId;

    return (
      <section className="manage-zone">
        <Banner
          header={MANAGE_ZONE_BANNER_HEADER}
          content={MANAGE_ZONE_BANNER_CONTENT}
        />

        <div className="manage-zone__content">
          <div className="manage-zone__steps">
            {errorOccuredGettingZones &&
              <ErrorMessage
                message={GET_ZONES_ERROR}
              />
            }

            <h3>Step 1: Select a zone</h3>
            <div className="manage-zone__step-one">
              <Dropdown
                id={ELEMENT_ID.MANAGE_ZONE_ZONES_DROPDOWN}
                placeholder="Zone (Description) - District"
                options={zoneOptions}
                value={zoneId}
                onChange={this.onZoneChanged}
                fluid
                search
                selection
                clearable
                selectOnBlur={false}
              />
            </div>

            <h3>Step 2: Assign a new staff</h3>
            <div className="manage-zone__step-two">
              <Dropdown
                id={ELEMENT_ID.MANAGE_ZONE_CONTACTS_DROPDOWN}
                placeholder="Username"
                options={contactOptions}
                value={newContactId}
                onChange={this.onContactChanged}
                fluid
                search
                selection
                clearable
                selectOnBlur={false}
              />
            </div>

            <div className="manage-zone__update-btn">
              <PrimaryButton
                loading={isAssigning}
                onClick={this.openUpdateConfirmationModal}
                disabled={!isUpdateBtnEnabled}
                content="Submit"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ManageZonePage;
