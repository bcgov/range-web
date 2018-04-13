import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ManazeZone from './ManageZone';
import { getUsers, getZones } from '../../actions/commonActions';
import { assignStaffToZone } from '../../actions/manageZoneActions';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  zones: PropTypes.arrayOf(PropTypes.object).isRequired,
  getUsers: PropTypes.func.isRequired,
  assignStaffToZone: PropTypes.func.isRequired,
  isAssigning: PropTypes.bool.isRequired,
};

class Base extends Component {
  componentWillMount() {
    this.props.getUsers();
  }

  render() {
    return (
      <ManazeZone
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => (
  {
    users: state.users.data,
    zones: state.zones.data,
    isAssigning: state.assignStaffToZone.isLoading,
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, { getUsers, getZones, assignStaffToZone })(Base);
