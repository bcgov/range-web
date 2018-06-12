import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button, Icon } from 'semantic-ui-react';
import debounce from 'lodash.debounce';
import { Banner, ConfirmationModal } from '../common';
import {
  MANAGE_CLIENT_BANNER_CONTENT,
  MANAGE_CLIENT_BANNER_HEADER,
  UPDATE_CLIENT_ID_FOR_AH_HEADER,
  UPDATE_CLIENT_ID_FOR_AH_CONTENT,
} from '../../constants/strings';
import { MANAGE_CLIENT_USERS_DROPDOWN_ELEMENT_ID, MANAGE_CLIENT_CLIENTS_DROPDOWN_ELEMENT_ID } from '../../constants/variables';
import { User } from '../../models';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  getClients: PropTypes.func.isRequired,
  linkClient: PropTypes.func.isRequired,
  clientLinked: PropTypes.func.isRequired,
  isLinkingClient: PropTypes.bool.isRequired,
  isLoadingClients: PropTypes.bool.isRequired,
};

class ManageClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      clientNumber: null,
      isUpdateModalOpen: false,
      startSearching: false,
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
    if (searchQuery) {
      const onSuccess = () => {
        this.setState({ startSearching: true });
      };
      this.props.getClients(searchQuery).then(onSuccess);
    }
  }

  linkUserToClient = () => {
    const { userId, clientNumber } = this.state;
    const { users, clientLinked, linkClient } = this.props;

    const onSuccess = (user) => {
      clientLinked(users, userId, user.clientId);
      this.closeUpdateConfirmationModal();
      this.setState({
        userId: null,
        clientNumber: null,
      });
    };
    linkClient(userId, clientNumber).then(onSuccess);
  }

  render() {
    const {
      users,
      clients,
      isLinkingClient,
      isLoadingClients,
    } = this.props;
    const {
      userId,
      clientNumber,
      startSearching,
      isUpdateModalOpen,
    } = this.state;

    const userOptions = users.map((u) => {
      const user = new User(u);
      const { id, fullName, email } = user;
      return {
        value: id,
        text: fullName,
        description: email,
      };
    });

    const clientOptions = clients.map((c) => {
      const { clientNumber, name } = c;
      return {
        key: clientNumber,
        value: clientNumber,
        text: name,
        description: clientNumber,
      };
    });

    const isUpdateBtnEnabled = userId && clientNumber;

    return (
      <div className="assign-client">
        <ConfirmationModal
          open={isUpdateModalOpen}
          loading={isLinkingClient}
          header={UPDATE_CLIENT_ID_FOR_AH_HEADER}
          content={UPDATE_CLIENT_ID_FOR_AH_CONTENT}
          onNoClicked={this.closeUpdateConfirmationModal}
          onYesClicked={this.linkUserToClient}
        />

        <Banner
          header={MANAGE_CLIENT_BANNER_HEADER}
          content={MANAGE_CLIENT_BANNER_CONTENT}
        />

        <div className="assign-client__content">
          <div className="assign-client__steps">
            <h3>Step 1: Select User</h3>
            <Dropdown
              id={MANAGE_CLIENT_USERS_DROPDOWN_ELEMENT_ID}
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
              id={MANAGE_CLIENT_CLIENTS_DROPDOWN_ELEMENT_ID}
              placeholder="Type Client Name"
              options={clientOptions}
              value={clientNumber}
              search
              selection
              loading={isLoadingClients}
              onChange={this.onClientChanged}
              onSearchChange={this.searchClientsWithDebounce}
              icon={<Icon name="search" size="small" />}
              noResultsMessage={startSearching ? 'No results found.' : null}
              selectOnBlur={false}
            />

            <div className="assign-client__update-btn">
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
      </div>
    );
  }
}

ManageClient.propTypes = propTypes;
export default ManageClient;
