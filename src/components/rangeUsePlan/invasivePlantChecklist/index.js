import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

class InvasivePlantChecklist extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    className: PropTypes.string.isRequired,
  };

  render() {
    const { className, plan } = this.props;
    const { invasivePlantChecklist } = plan;
    const {
      equipmentAndVehiclesParking = false,
      beginInUninfestedArea = false,
      undercarrigesInspected = false,
      revegetate = false,
      other,
    } = invasivePlantChecklist;
    const otherChecked = typeof other === 'string';

    return (
      <div className={className}>
        <div className="rup__content-title">Invasive Plants</div>
        <div className="rup__divider" />
        <div className="rup__ip-checklist__header">
          I commit to carry out the following measures to prevent the introduction or spread of invasive plants that are likely the result of my range practices:
        </div>
        <div className="rup__ip-checklist__form">
          <Form>
            <Form.Group grouped>
              <Form.Checkbox
                inline
                label="Equipment and vehicles will not be parked on invasive plant infestations"
                disabled
                checked={equipmentAndVehiclesParking}
              />
              <Form.Checkbox
                inline
                label="Any work will being in un-infested areas before moving to infested locations"
                disabled
                checked={beginInUninfestedArea}
              />
              <Form.Checkbox
                inline
                label="Clothing and vehicle/equipment undercarriages will be regularly inspected for plant parts or propagules if working in an area known to contain invasive plants"
                disabled
                checked={undercarrigesInspected}
              />
              <Form.Checkbox
                inline
                label="Revegetate disturbed areas that have exposed mineral soil within one year of disturbance by seeding using Common #1 Forage Mixture or better. The certificate of seed analysis will be requested and seed that contains weed seeds of listed invasive plants and/or invasive plants that are high priority to the area will be rejected. Seeding will occur around range developments and areas of cattle congregation where bare soil is exposed. Revegetated areas will be monitored and revegetated as necessary until exposed soil is eliminated."
                disabled
                checked={revegetate}
              />
              <Form.Checkbox
                inline
                label="Other: (Please Describe)"
                disabled
                checked={otherChecked}
              />
              {otherChecked &&
                <div className="rup__ip-checklist__form__textarea">
                  <Form.TextArea
                    value={other}
                    disabled
                  />
                </div>
              }
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

export default InvasivePlantChecklist;
