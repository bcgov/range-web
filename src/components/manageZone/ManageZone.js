import React, { Component } from 'react';
import { Banner, ConfirmationModal } from '../common';
import { Dropdown, Button } from 'semantic-ui-react';
import { 
  MANAGE_ZONE_BANNER_CONTENT, MANAGE_ZONE_BANNER_HEADER,
  UPDATE_CONTACT_CONFIRMATION_CONTENT, UPDATE_CONTACT_CONFIRMATION_HEADER,
  NOT_SELECTED,
} from '../../constants/strings';

export class ManageZone extends Component {
  state = {
    newContact: null,
    currContact: null,
    zone: null,
    isUpdateModalOpen: false,
  }

  onZoneChanged = (e, { value }) => {
    this.setState({ 
      zone: value,
      currContact: 'Jar Jar Binks'
    });
  }

  onContactChanged = (e, { value }) => {
    this.setState({ newContact: value });
  }

  closeUpdateConfirmationModal = () => {
    this.setState({ isUpdateModalOpen: false });
  }

  openUpdateConfirmationModal = () => {
    this.setState({ isUpdateModalOpen: true });
  }

  render() {
    const zoneOptions = [
      { key: 1, text: 'LASO', value: 'LASO', },
      { key: 2, text: 'VIC', value: 'VIC', },
    ];
    const contactOptions = [
      { key: 1, text: 'Luke Skywalker', value: 'Luke Skywalker', },
      { key: 2, text: 'Obi-Wan Kenobi', value: 'Obi-Wan Kenobi', },
      { key: 3, text: 'Han Solo', value: 'Han Solo', },
      { key: 4, text: 'Leia Organa', value: 'Leia Organa', },
    ];

    const { zone, isUpdateModalOpen, currContact, newContact } = this.state;

    return (
      <div className="manage-zone">
        <ConfirmationModal
          open={isUpdateModalOpen}
          header={UPDATE_CONTACT_CONFIRMATION_HEADER}
          content={UPDATE_CONTACT_CONFIRMATION_CONTENT}
          onNoClicked={this.closeUpdateConfirmationModal}
          onYesClicked={this.closeUpdateConfirmationModal}
        />

        <Banner 
          header={MANAGE_ZONE_BANNER_HEADER}
          content={MANAGE_ZONE_BANNER_CONTENT}
        />

        <div className="manage-zone__content container">
          <div className="manage-zone__steps">
            <h3>Step 1: Select a zone</h3>
            <div className="manage-zone__step-one">
              <div className="manage-zone__dropdown">
                <Dropdown 
                  placeholder='Zone' 
                  options={zoneOptions}
                  onChange={this.onZoneChanged}
                  fluid 
                  search 
                  selection 
                />
              </div>
              <div className="manage-zone__text-field">
                <div className="manage-zone__text-field__title">Assigned Zone Contact</div>
                <div>{currContact || NOT_SELECTED}</div> 
              </div>
            </div>

            <h3>Step 2: Assign a new contact</h3>
            <div className="manage-zone__step-two">
              {/* <div className="manage-zone__text-field">
                {zone ||'Zone'}
              </div> */}
              <div className="manage-zone__dropdown">
                <Dropdown 
                  placeholder='Contact' 
                  options={contactOptions} 
                  onChange={this.onContactChanged}
                  fluid
                  search
                  selection 
                />
              </div>
            </div>

            <div className="manage-zone__update-btn">
              <Button 
                onClick={this.openUpdateConfirmationModal}
                primary
              >
                Update Zone
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ManageZone;