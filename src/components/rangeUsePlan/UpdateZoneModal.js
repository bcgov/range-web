import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Button, Dropdown, Modal } from 'semantic-ui-react';
import { updateRupZone } from '../../actions/rangeUsePlanActions';


const propTypes = {
  isUpdateZoneModalOpen: PropTypes.bool.isRequired,
  closeUpdateZoneModal: PropTypes.func.isRequired,
  onZoneUpdated: PropTypes.func.isRequired,
  currZone: PropTypes.shape({}).isRequired,
  updateRupZone: PropTypes.func.isRequired,
  agreementId: PropTypes.string.isRequired,
  zones: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isUpdating: PropTypes.bool.isRequired,
};

export class UpdateZoneModal extends Component {
  state = {
    newZoneId: null,
  }

  onZoneChanged = (e, { value }) => {
    this.setState({ newZoneId: value });
  }

  onUpdateZoneClicked = () => {
    const { agreementId, updateRupZone, onZoneUpdated } = this.props;
    const requestData = {
      agreementId,
      zoneId: this.state.newZoneId,
    };
    updateRupZone(requestData).then((newZone) => {
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
      currZone,
      isUpdating,
    } = this.props;
    const { newZoneId } = this.state;

    const currDistrictId = currZone && currZone.district && currZone.district.id;
    const currZoneCode = currZone && currZone.code;
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
      <Modal open={isUpdateZoneModalOpen} onClose={this.closeUpdateZoneModal}>
        <Modal.Header>Update Zone</Modal.Header>
        <Modal.Content>
          <Header>Pick a new zone within the district</Header>
          <Dropdown
            id="range-use-plan__zone-dropdown"
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
            loading={isUpdating}
            onClick={this.onUpdateZoneClicked}>
            Update Zone
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => (
  {
    isUpdating: state.updateRupZone.isLoading,
    zones: state.zones.data,
  }
);

UpdateZoneModal.propTypes = propTypes;
export default connect(mapStateToProps, { updateRupZone })(UpdateZoneModal);
