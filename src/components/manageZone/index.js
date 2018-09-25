import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ManageZone from './ManageZone';
import { fetchUsers, updateUserIdOfZone } from '../../actionCreators';
import { zoneUpdated, openConfirmationModal, closeConfirmationModal } from '../../actions';
import { getZones, getZonesMap, getUsers, getIsUpdatingUserIdOfZone } from '../../reducers/rootReducer';
import { MANAGE_ZONE_TITLE } from '../../constants/strings';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  zones: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchUsers: PropTypes.func.isRequired,
  updateUserIdOfZone: PropTypes.func.isRequired,
  zoneUpdated: PropTypes.func.isRequired,
  isAssigning: PropTypes.bool.isRequired,
};

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

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  fetchUsers,
  updateUserIdOfZone,
  zoneUpdated,
  openConfirmationModal,
  closeConfirmationModal,
})(Base);
