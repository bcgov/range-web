import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button, Icon } from 'semantic-ui-react';
import { debounce } from 'lodash';
import { Banner, ConfirmationModal } from '../common';
import {
  MANAGE_CLIENT_BANNER_CONTENT,
  MANAGE_CLIENT_BANNER_HEADER,
  UPDATE_CLIENT_ID_FOR_AH_HEADER,
  UPDATE_CLIENT_ID_FOR_AH_CONTENT,
  TYPE_CLIENT_NAME,
} from '../../constants/strings';
import { ELEMENT_ID } from '../../constants/variables';
import { getUserfullName } from '../../utils';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersMap: PropTypes.shape({}).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchClients: PropTypes.func.isRequired,
  updateClientIdOfUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  isUpdatingClientIdOfUser: PropTypes.bool.isRequired,
  isFetchingClients: PropTypes.bool.isRequired,
};

class ManageClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      clientNumber: null,
      isUpdateModalOpen: false,
      searchQuery: '',
    };
    this.searchClientsWithDebounce = debounce(this.handleSearchChange, 1000);
  }

  onUserChanged = (e, { value: userId }) => {
    this.setState({ userId });
  }

  onClientChanged = (e, { value: clientNumber }) => {
    this.setState({ clientNumber });
  }

  closeUpdateConfirmationModal = () => this.setState({ isUpdateModalOpen: false })
  openUpdateConfirmationModal = () => this.setState({ isUpdateModalOpen: true })

  handleSearchChange = (e, { searchQuery }) => {
    this.setState({ searchQuery });
    this.props.searchClients(searchQuery);
  }

  linkUserToClient = () => {
    const { userId, clientNumber } = this.state;
    const { usersMap, updateUser, updateClientIdOfUser } = this.props;

    const onSuccess = (newUser) => {
      const user = {
        ...usersMap[userId],
        clientId: newUser.clientId,
      };
      updateUser(user);
      this.closeUpdateConfirmationModal();
      this.setState({
        userId: null,
        clientNumber: null,
      });
    };
    updateClientIdOfUser(userId, clientNumber).then(onSuccess);
  }

  render() {
    const {
      users,
      clients,
      isUpdatingClientIdOfUser,
      isFetchingClients,
    } = this.props;
    const {
      userId,
      clientNumber,
      searchQuery,
      isUpdateModalOpen,
    } = this.state;

    const userOptions = users.map((user) => {
      const { email, clientId } = user;
      const description = clientId ? `Client #: ${clientId}, Email: ${email}` : `Email: ${email}`;
      return {
        value: user.id,
        text: getUserfullName(user),
        description,
      };
    });

    const clientOptions = clients.map((c) => {
      const { clientNumber, name } = c;
      return {
        key: clientNumber,
        value: clientNumber,
        text: name,
        description: `Client #: ${clientNumber}`,
      };
    });

    const isUpdateBtnEnabled = userId && clientNumber;

    return (
      <section className="manage-client">
        <ConfirmationModal
          open={isUpdateModalOpen}
          loading={isUpdatingClientIdOfUser}
          header={UPDATE_CLIENT_ID_FOR_AH_HEADER}
          content={UPDATE_CLIENT_ID_FOR_AH_CONTENT}
          onNoClicked={this.closeUpdateConfirmationModal}
          onYesClicked={this.linkUserToClient}
        />

        <Banner
          header={MANAGE_CLIENT_BANNER_HEADER}
          content={MANAGE_CLIENT_BANNER_CONTENT}
        />

        <div className="manage-client__content">
          <div className="manage-client__steps">
            <h3>Step 1: Select User</h3>
            <Dropdown
              id={ELEMENT_ID.MANAGE_CLIENT_USERS_DROPDOWN}
              placeholder="Select User"
              options={userOptions}
              value={userId}
              onChange={this.onUserChanged}
              search
              selection
              selectOnBlur={false}
            />

            <h3>Step 2: Search and Select Corresponding Client</h3>
            <Dropdown
              id={ELEMENT_ID.MANAGE_CLIENT_CLIENTS_DROPDOWN}
              placeholder={TYPE_CLIENT_NAME}
              options={clientOptions}
              value={clientNumber}
              search
              selection
              loading={isFetchingClients}
              onChange={this.onClientChanged}
              onSearchChange={this.searchClientsWithDebounce}
              icon={<Icon name="search" size="small" />}
              noResultsMessage={searchQuery ? 'No results found.' : TYPE_CLIENT_NAME}
              selectOnBlur={false}
            />

            <div className="manage-client__update-btn">
              <Button
                primary
                onClick={this.openUpdateConfirmationModal}
                disabled={!isUpdateBtnEnabled}
              >
                Link User
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

ManageClient.propTypes = propTypes;
export default ManageClient;
