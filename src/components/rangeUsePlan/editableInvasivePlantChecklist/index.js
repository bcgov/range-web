import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { planUpdated } from '../../../actions';

class EditableInvasivePlantChecklist extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    planUpdated: PropTypes.func.isRequired,
  };

  handleInvasivePlantChange = (name, value) => {
    const { plan, planUpdated } = this.props;
    const updatedChecklist = {
      ...plan.invasivePlantChecklist,
      [name]: value,
    };
    if (name === 'otherChecked' && value === false) {
      updatedChecklist.other = null;
    }
    const updatedPlan = {
      ...plan,
      invasivePlantChecklist: updatedChecklist,
    };

    planUpdated({ plan: updatedPlan });
  }

  onCheckboxClicked = (e, { name, checked }) => {
    this.handleInvasivePlantChange(name, checked);
  }

  onOtherChanged = (e, { value }) => {
    this.handleInvasivePlantChange('other', value);
  }

  render() {
    const { plan } = this.props;
    const { invasivePlantChecklist } = plan;
    const {
      equipmentAndVehiclesParking = false,
      beginInUninfestedArea = false,
      undercarrigesInspected = false,
      revegetate = false,
      other,
      otherChecked = false || (typeof other === 'string' && other.length > 0),
    } = invasivePlantChecklist;

    return (
      <div className="rup__ip-checklist">
        <div className="rup__content-title">Invasive Plants</div>
        <div className="rup__divider" />
        <div className="rup__ip-checklist__header">
          I commit to carry out the following measures to prevent the introduction or spread of invasive plants that are likely the result of my range practices:
        </div>
        <div className="rup__ip-checklist__form">
          <Form>
            <Form.Group grouped>
              <Form.Checkbox
                name="equipmentAndVehiclesParking"
                inline
                label="Equipment and vehicles will not be parked on invasive plant infestations"
                checked={equipmentAndVehiclesParking}
                onChange={this.onCheckboxClicked}
              />
              <Form.Checkbox
                name="beginInUninfestedArea"
                inline
                label="Any work will being in un-infested areas before moving to infested locations"
                checked={beginInUninfestedArea}
                onChange={this.onCheckboxClicked}
              />
              <Form.Checkbox
                name="undercarrigesInspected"
                inline
                label="Clothing and vehicle/equipment undercarriages will be regularly inspected for plant parts or propagules if working in an area known to contain invasive plants"
                checked={undercarrigesInspected}
                onChange={this.onCheckboxClicked}
              />
              <Form.Checkbox
                name="revegetate"
                inline
                label="Revegetate disturbed areas that have exposed mineral soil within one year of disturbance by seeding using Common #1 Forage Mixture or better. The certificate of seed analysis will be requested and seed that contains weed seeds of listed invasive plants and/or invasive plants that are high priority to the area will be rejected. Seeding will occur around range developments and areas of cattle congregation where bare soil is exposed. Revegetated areas will be monitored and revegetated as necessary until exposed soil is eliminated."
                checked={revegetate}
                onChange={this.onCheckboxClicked}
              />
              <Form.Checkbox
                name="otherChecked"
                inline
                label="Other: (Please Describe)"
                checked={otherChecked}
                onChange={this.onCheckboxClicked}
              />
              {otherChecked &&
                <div className="rup__ip-checklist__form__textarea">
                  <Form.TextArea
                    value={other || ''}
                    onChange={this.onOtherChanged}
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

export default connect(null, {
  planUpdated,
})(EditableInvasivePlantChecklist);
