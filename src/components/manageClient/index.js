import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ManageClient from './ManageClient';
import { fetchUsers, searchClients, updateClientIdOfUser } from '../../actionCreators';
import { updateUser } from '../../actions';
import { getUsers, getClients, getClientsIsFetching, getUserIdOfZoneIsUpdating, getUsersMap } from '../../reducers/rootReducer';

const propTypes = {
  fetchUsers: PropTypes.func.isRequired,
};

class Base extends Component {
  componentWillMount() {
    this.props.fetchUsers();
  }

  render() {
    return (
      <ManageClient
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => (
  {
    users: getUsers(state),
    usersMap: getUsersMap(state),
    clients: getClients(state),
    isFetchingClients: getClientsIsFetching(state),
    isUpdatingClientIdOfUser: getUserIdOfZoneIsUpdating(state),
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  fetchUsers,
  searchClients,
  updateClientIdOfUser,
  updateUser,
})(Base);
