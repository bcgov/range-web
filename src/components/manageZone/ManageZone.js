import React, { Component } from 'react';
import { Banner } from '../common';
import { Dropdown, Button } from 'semantic-ui-react';

export class ManageZone extends Component {
  render() {
    const zoneOptions = [];
    const contactOptions = [];

    return (
      <div className="manage-zone">
        <Banner 
          header="Manage Zone"
          content="This is where the description of Manage Zone would go. This is where the description of Manage Zone would go. 
          This is where the description of Manage Zone would go."
        />
        <div className="manage-zone__content container">
          <div className="manage-zone__steps">
            <h3>Step 1: Pick A Zone</h3>
            <div className="manage-zone__step-one">
              <div className="manage-zone__dropdown">
                <Dropdown placeholder='Zone' fluid search selection options={zoneOptions} />
              </div>
              <div className="manage-zone__text-field">Assigned Zone Contact</div>
            </div>

            <h3>Step 2: Change A Zone Contact</h3>
            <div className="manage-zone__step-two">
              <div className="manage-zone__text-field">Zone</div>
              <div className="manage-zone__dropdown">
                <Dropdown placeholder='Contact' fluid search selection options={contactOptions} />
              </div>
            </div>

            <div className="manage-zone__update-btn">
              <Button primary>Update Zone</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ManageZone;