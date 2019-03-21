import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ManageZonePage from './ManageZonePage';
import { fetchUsers, updateUserIdOfZone, fetchZones } from '../../actionCreators';
import { zoneUpdated, openConfirmationModal } from '../../actions';
import { getZones, getZonesMap, getUsers, getIsUpdatingUserIdOfZone, getZonesErrorOccured } from '../../reducers/rootReducer';
import { MANAGE_ZONE_TITLE } from '../../constants/strings';

class Base extends Component {
  static propTypes = {
    fetchZones: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { fetchUsers, fetchZones } = this.props;
    document.title = MANAGE_ZONE_TITLE;

    fetchZones();
    fetchUsers();
  }

  render() {
    return (
      <ManageZonePage
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => (
  {
    zones: getZones(state),
    zonesMap: getZonesMap(state),
    errorOccuredGettingZones: getZonesErrorOccured(state),
    users: getUsers(state),
    isAssigning: getIsUpdatingUserIdOfZone(state),
  }
);

export default connect(mapStateToProps, {
  fetchUsers,
  fetchZones,
  updateUserIdOfZone,
  zoneUpdated,
  openConfirmationModal,
})(Base);
