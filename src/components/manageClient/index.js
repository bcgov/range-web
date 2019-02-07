import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ManageClient from './ManageClient';
import { fetchUsers, searchClients, updateClientIdOfUser } from '../../actionCreators';
import { userUpdated, openConfirmationModal, closeConfirmationModal } from '../../actions';
import { getUsers, getClients, getIsFetchingClients, getIsUpdatingClientIdOfUser, getUsersMap } from '../../reducers/rootReducer';
import { MANAGE_CLIENT_TITLE } from '../../constants/strings';

const propTypes = {
  fetchUsers: PropTypes.func.isRequired,
};

class Base extends Component {
  componentWillMount() {
    document.title = MANAGE_CLIENT_TITLE;

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
    isUpdatingClientIdOfUser: getIsUpdatingClientIdOfUser(state),
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  fetchUsers,
  searchClients,
  updateClientIdOfUser,
  userUpdated,
  openConfirmationModal,
  closeConfirmationModal,
})(Base);
