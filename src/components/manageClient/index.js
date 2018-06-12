import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ManageClient from './ManageClient';
import { getUsers } from '../../actions/commonActions';
import { getClients, linkClient, clientLinked } from '../../actions/manageClientActions';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  getUsers: PropTypes.func.isRequired,
  getClients: PropTypes.func.isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
};

class Base extends Component {
  componentWillMount() {
    this.props.getUsers();
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
    users: state.users.data,
    clients: state.clients.data,
    isLoadingClients: state.clients.isLoading,
    isLinkingClient: state.linkClient.isLoading,
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  getUsers,
  getClients,
  linkClient,
  clientLinked,
})(Base);
