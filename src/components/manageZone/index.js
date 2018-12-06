import React, { Component } from 'react';
import { connect } from 'react-redux';
import ManageZone from './ManageZone';
import { fetchUsers, updateUserIdOfZone } from '../../actionCreators';
import { zoneUpdated, openConfirmationModal, closeConfirmationModal } from '../../actions';
import { getZones, getZonesMap, getUsers, getIsUpdatingUserIdOfZone } from '../../reducers/rootReducer';
import { MANAGE_ZONE_TITLE } from '../../constants/strings';

class Base extends Component {
  componentWillMount() {
    document.title = MANAGE_ZONE_TITLE;

    this.props.fetchUsers();
  }

  render() {
    return (
      <ManageZone
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => (
  {
    zones: getZones(state),
    zonesMap: getZonesMap(state),
    users: getUsers(state),
    isAssigning: getIsUpdatingUserIdOfZone(state),
  }
);

export default connect(mapStateToProps, {
  fetchUsers,
  updateUserIdOfZone,
  zoneUpdated,
  openConfirmationModal,
  closeConfirmationModal,
})(Base);
