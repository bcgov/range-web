import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ManageZone from './ManageZone';
import { fetchUsers, updateUserIDOfZone } from '../../actionCreators';
import { updateZone } from '../../actions';
import { getZones, getZonesMap, getUsers, getUserIdOfZoneIsUpdating } from '../../reducers/rootReducer';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  zones: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchUsers: PropTypes.func.isRequired,
  updateUserIDOfZone: PropTypes.func.isRequired,
  updateZone: PropTypes.func.isRequired,
  isAssigning: PropTypes.bool.isRequired,
};

class Base extends Component {
  componentWillMount() {
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
    isAssigning: getUserIdOfZoneIsUpdating(state),
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  fetchUsers,
  updateUserIDOfZone,
  updateZone,
})(Base);
