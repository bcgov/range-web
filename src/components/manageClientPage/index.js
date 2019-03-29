import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ManageClientPage from './ManageClientPage';
import { fetchUsers, searchClients, updateClientIdOfUser } from '../../actionCreators';
import { userUpdated, openConfirmationModal } from '../../actions';
import { getUsers, getClients, getIsFetchingClients, getIsUpdatingClientIdOfUser, getUsersMap, getUsersErrorOccured, getReAuthRequired } from '../../reducers/rootReducer';
import { MANAGE_CLIENT_TITLE } from '../../constants/strings';

const propTypes = {
  fetchUsers: PropTypes.func.isRequired,
  reAuthRequired: PropTypes.bool.isRequired,
  errorOccuredGettingUsers: PropTypes.bool.isRequired,
};

class Base extends Component {
  componentWillMount() {
    document.title = MANAGE_CLIENT_TITLE;

    this.fetchUsers();
  }

  componentWillReceiveProps(nextProps) {
    const { reAuthRequired, errorOccuredGettingUsers } = nextProps;

    // fetch users if the user just reauthenticate and there was an error occurred
    const justReAuthenticated = this.props.reAuthRequired === true && reAuthRequired === false;
    if (justReAuthenticated && errorOccuredGettingUsers) {
      this.fetchUsers();
    }
  }

  fetchUsers = () => {
    this.props.fetchUsers({
      orderCId: 'desc',
      excludeBy: 'email',
      exclude: '@gov.bc.ca',
    });
  }

  render() {
    return (
      <ManageClientPage
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => (
  {
    users: getUsers(state),
    usersMap: getUsersMap(state),
    errorOccuredGettingUsers: getUsersErrorOccured(state),
    clients: getClients(state),
    isFetchingClients: getIsFetchingClients(state),
    isUpdatingClientIdOfUser: getIsUpdatingClientIdOfUser(state),
    reAuthRequired: getReAuthRequired(state),
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  fetchUsers,
  searchClients,
  updateClientIdOfUser,
  userUpdated,
  openConfirmationModal,
})(Base);
