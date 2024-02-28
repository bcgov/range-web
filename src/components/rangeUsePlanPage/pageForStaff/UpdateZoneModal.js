import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Dropdown, Modal, Icon } from 'semantic-ui-react';
import { updateAgreementZone } from '../../../actionCreators';
import { ELEMENT_ID } from '../../../constants/variables';
import {
  getZones,
  getIsUpdatingAgreementZone,
} from '../../../reducers/rootReducer';
import { planUpdated } from '../../../actions';
import { NOT_ASSIGNED, NO_DESCRIPTION } from '../../../constants/strings';
import { getUserFullName } from '../../../utils';
import { PrimaryButton } from '../../common';

// the componenet is no longer needed since the database is periodically updated by FTA apis
export class UpdateZoneModal extends Component {
  static propTypes = {
    agreement: PropTypes.shape({ zone: PropTypes.object }).isRequired,
    plan: PropTypes.shape({}).isRequired,
    isUpdateZoneModalOpen: PropTypes.bool.isRequired,
    closeUpdateZoneModal: PropTypes.func.isRequired,
    updateAgreementZone: PropTypes.func.isRequired,
    zones: PropTypes.arrayOf(PropTypes.object).isRequired,
    isUpdatingAgreementZone: PropTypes.bool.isRequired,
    planUpdated: PropTypes.func.isRequired,
  };

  state = {
    newZoneId: null,
  };

  onZoneChanged = (e, { value }) => {
    this.setState({ newZoneId: value });
  };

  onUpdateZoneClicked = () => {
    const { agreement, updateAgreementZone, planUpdated, plan } = this.props;
    const requestData = {
      agreementId: agreement.id,
      zoneId: this.state.newZoneId,
    };
    const onZoneUpdated = (newZone) => {
      const newAgreement = { ...plan.agreement, zone: newZone };
      const newPlan = {
        ...plan,
        agreement: newAgreement,
      };
      planUpdated({ plan: newPlan });
    };
    updateAgreementZone(requestData).then((newZone) => {
      onZoneUpdated(newZone);
      this.closeUpdateZoneModal();
    });
  };

  closeUpdateZoneModal = () => {
    this.setState({ newZoneId: null });
    this.props.closeUpdateZoneModal();
  };

  render() {
    const { isUpdateZoneModalOpen, zones, isUpdatingAgreementZone, agreement } =
      this.props;
    const { newZoneId } = this.state;

    const currZone = agreement && agreement.zone;
    const currDistrictId = currZone.district && currZone.district.id;
    const currZoneCode = currZone.code;
    const zoneOptions = zones
      .filter(
        (zone) =>
          zone.districtId === currDistrictId && zone.code !== currZoneCode,
      )
      .map((z) => {
        const {
          id: zoneId,
          code: zoneCode,
          user: staff,
          description: zoneDescription,
        } = z;
        const option = {
          value: zoneId,
          text: zoneCode,
          description: NOT_ASSIGNED,
        };
        let description = zoneDescription;
        if (
          zoneDescription === 'Please update contact and description' ||
          zoneDescription === 'Please update contact'
        ) {
          description = NO_DESCRIPTION;
        }
        option.text += ` (${description})`;
        if (staff) {
          option.description = getUserFullName(staff);
        }

        return option;
      });

    return (
      <Modal
        dimmer="blurring"
        open={isUpdateZoneModalOpen}
        onClose={this.closeUpdateZoneModal}
        closeIcon={<Icon name="close" color="black" />}
      >
        <Modal.Header>Update Zone</Modal.Header>
        <Modal.Content>
          <Header>Pick a new zone within the district</Header>
          <Dropdown
            id={ELEMENT_ID.RUP_ZONE_DROPDOWN}
            placeholder="Zone (Description)"
            options={zoneOptions}
            onChange={this.onZoneChanged}
            selectOnBlur={false}
            fluid
            search
            selection
            clearable
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '10px',
            }}
          >
            <PrimaryButton
              inverted
              onClick={this.closeUpdateZoneModal}
              content="Cancel"
            />
            <PrimaryButton
              disabled={newZoneId === null}
              loading={isUpdatingAgreementZone}
              onClick={this.onUpdateZoneClicked}
              style={{ margin: '0', marginLeft: '10px' }}
              content="Update Zone"
            />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  isUpdatingAgreementZone: getIsUpdatingAgreementZone(state),
  zones: getZones(state),
});

export default connect(mapStateToProps, {
  updateAgreementZone,
  planUpdated,
})(UpdateZoneModal);
