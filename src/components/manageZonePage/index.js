import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ManageZonePage from './ManageZonePage';
import { fetchUsers, updateUserIdOfZone, fetchZones } from '../../actionCreators';
import { zoneUpdated, openConfirmationModal } from '../../actions';
import { getZones, getZonesMap, getUsers, getIsUpdatingUserIdOfZone, getZonesErrorOccured, getReAuthRequired } from '../../reducers/rootReducer';
import { MANAGE_ZONE_TITLE } from '../../constants/strings';

class Base extends Component {
  static propTypes = {
    fetchZones: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    reAuthRequired: PropTypes.bool.isRequired,
    errorOccuredGettingZones: PropTypes.bool.isRequired,
  }

  componentWillMount() {
    document.title = MANAGE_ZONE_TITLE;
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    const { reAuthRequired, errorOccuredGettingZones } = nextProps;

    // fetch zones and users if the user just reauthenticate and there was an error occurred
    const justReAuthenticated = this.props.reAuthRequired === true && reAuthRequired === false;
    if (justReAuthenticated && errorOccuredGettingZones) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { fetchUsers, fetchZones } = this.props;
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
    reAuthRequired: getReAuthRequired(state),
  }
);

export default connect(mapStateToProps, {
  fetchUsers,
  fetchZones,
  updateUserIdOfZone,
  zoneUpdated,
  openConfirmationModal,
})(Base);
