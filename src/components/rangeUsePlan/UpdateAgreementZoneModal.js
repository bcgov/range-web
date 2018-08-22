import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Button, Dropdown, Modal, Icon } from 'semantic-ui-react';
import { updateAgreementZone } from '../../actionCreators';
import { ELEMENT_ID } from '../../constants/variables';
import { getZones, getIsUpdatingAgreementZone } from '../../reducers/rootReducer';
import { updatePlan } from '../../actions';

const propTypes = {
  agreement: PropTypes.shape({ zone: PropTypes.object }).isRequired,
  plan: PropTypes.shape({}).isRequired,
  isUpdateZoneModalOpen: PropTypes.bool.isRequired,
  closeUpdateZoneModal: PropTypes.func.isRequired,
  updateAgreementZone: PropTypes.func.isRequired,
  zones: PropTypes.arrayOf(PropTypes.object).isRequired,
  isUpdatingAgreementZone: PropTypes.bool.isRequired,
  updatePlan: PropTypes.func.isRequired,
};

export class UpdateZoneModal extends Component {
  state = {
    newZoneId: null,
  }

  onZoneChanged = (e, { value }) => {
    this.setState({ newZoneId: value });
  }

  onUpdateZoneClicked = () => {
    const { agreement, updateAgreementZone, updatePlan, plan } = this.props;
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
      updatePlan({ plan: newPlan });
    };
    updateAgreementZone(requestData).then((newZone) => {
      onZoneUpdated(newZone);
      this.closeUpdateZoneModal();
    });
  }

  closeUpdateZoneModal = () => {
    this.setState({ newZoneId: null });
    this.props.closeUpdateZoneModal();
  }

  render() {
    const {
      isUpdateZoneModalOpen,
      zones,
      isUpdatingAgreementZone,
      agreement,
    } = this.props;
    const { newZoneId } = this.state;

    const currZone = agreement && agreement.zone;
    const currDistrictId = currZone.district && currZone.district.id;
    const currZoneCode = currZone.code;
    const zoneOptions = zones
      .filter(zone => (zone.districtId === currDistrictId) && (zone.code !== currZoneCode))
      .map((z) => {
        const { id, code, description } = z;
        const zone = {
          key: id,
          text: code,
          value: id,
          description,
        };
        return zone;
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
            placeholder="Zone"
            options={zoneOptions}
            onChange={this.onZoneChanged}
            fluid
            search
            selection
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" inverted onClick={this.closeUpdateZoneModal}>
            Cancel
          </Button>
          <Button
            color="green"
            inverted
            disabled={newZoneId === null}
            loading={isUpdatingAgreementZone}
            onClick={this.onUpdateZoneClicked}
          >
            Update Zone
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => (
  {
    isUpdatingAgreementZone: getIsUpdatingAgreementZone(state),
    zones: getZones(state),
  }
);

UpdateZoneModal.propTypes = propTypes;
export default connect(mapStateToProps, { updateAgreementZone, updatePlan })(UpdateZoneModal);
