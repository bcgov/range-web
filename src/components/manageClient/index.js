import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import ManageClient from './ManageClient';
import { fetchUsers, searchClients, updateClientIdOfUser } from '../../actionCreators';
import { updateUser } from '../../actions';
import { getUsers, getClients } from '../../reducers/rootReducer';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchUsers: PropTypes.func.isRequired,
  searchClients: PropTypes.func.isRequired,
  // location: PropTypes.shape({ search: PropTypes.string }).isRequired,
};

class Base extends Component {
  componentWillMount() {
    this.props.fetchUsers();
    this.props.searchClients('hatch')
  }

  render() {
    return (
      <div>client</div>
      // <ManageClient
      //   {...this.props}
      // />
    );
  }
}

const mapStateToProps = state => (
  {
    users: getUsers(state),
    clients: getClients(state),
    // isLoadingClients: state.clients.isLoading,
    // isLinkingClient: state.linkClient.isLoading,
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  fetchUsers,
  searchClients,
  updateClientIdOfUser,
  updateUser,
})(Base);
