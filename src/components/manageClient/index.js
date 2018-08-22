import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ManageClient from './ManageClient';
import { fetchUsers, searchClients, updateClientIdOfUser } from '../../actionCreators';
import { updateUser, openConfirmationModal, closeConfirmationModal } from '../../actions';
import { getUsers, getClients, getIsFetchingClients, getIsUpdatingUserIdOfZone, getUsersMap } from '../../reducers/rootReducer';

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
    isFetchingClients: getIsFetchingClients(state),
    isUpdatingClientIdOfUser: getIsUpdatingUserIdOfZone(state),
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  fetchUsers,
  searchClients,
  updateClientIdOfUser,
  updateUser,
  openConfirmationModal,
  closeConfirmationModal,
})(Base);
