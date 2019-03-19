import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon } from 'semantic-ui-react';
import debounce from 'lodash.debounce';
import { Banner, PrimaryButton, ErrorMessage } from '../common';
import * as strings from '../../constants/strings';
import { ELEMENT_ID, CONFIRMATION_MODAL_ID } from '../../constants/variables';
import { getClientOption, getUserOption } from '../../utils';

class ManageClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      clientNumber: null,
      searchQuery: '',
    };
    this.searchClientsWithDebounce = debounce(this.handleSearchChange, 1000);
  }

  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    usersMap: PropTypes.shape({}).isRequired,
    errorOccuredGettingUsers: PropTypes.bool.isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    searchClients: PropTypes.func.isRequired,
    updateClientIdOfUser: PropTypes.func.isRequired,
    isUpdatingClientIdOfUser: PropTypes.bool.isRequired,
    userUpdated: PropTypes.func.isRequired,
    isFetchingClients: PropTypes.bool.isRequired,
    openConfirmationModal: PropTypes.func.isRequired,
  };

  onUserChanged = (e, { value: userId }) => {
    this.setState({ userId });
  }

  onClientChanged = (e, { value: clientNumber }) => {
    this.setState({ clientNumber });
  }

  openUpdateConfirmationModal = () => {
    this.props.openConfirmationModal({
      id: CONFIRMATION_MODAL_ID.MANAGE_CLIENT,
      header: strings.UPDATE_CLIENT_ID_CONFIRM_HEADER,
      content: strings.UPDATE_CLIENT_ID_CONFIRM_CONTENT,
      onYesBtnClicked: this.linkUserToClient,
      closeAfterYesBtnClicked: true,
    });
  }

  handleSearchChange = (e, { searchQuery }) => {
    this.setState({ searchQuery });
    this.props.searchClients(searchQuery);
  }

  linkUserToClient = () => {
    const { userId, clientNumber } = this.state;
    const { usersMap, userUpdated, updateClientIdOfUser } = this.props;

    const onSuccess = (newUser) => {
      const user = {
        ...usersMap[userId],
        clientId: newUser.clientId,
      };

      userUpdated(user);

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
      isFetchingClients,
      isUpdatingClientIdOfUser,
      errorOccuredGettingUsers,
    } = this.props;
    const {
      userId,
      clientNumber,
      searchQuery,
    } = this.state;

    const userOptions = users.map(user => getUserOption(user));
    const clientOptions = clients.map(client => getClientOption(client));

    const isUpdateBtnEnabled = userId && clientNumber;

    let noResultsMessage = strings.NO_RESULTS_FOUND;
    if (isFetchingClients) {
      noResultsMessage = 'Fetching clients...';
    } else if (!searchQuery) {
      noResultsMessage = strings.TYPE_CLIENT_NAME;
    }

    return (
      <section className="manage-client">
        <Banner
          header={strings.MANAGE_CLIENT_BANNER_HEADER}
          content={strings.MANAGE_CLIENT_BANNER_CONTENT}
        />

        <div className="manage-client__content">
          <div className="manage-client__steps">
            {errorOccuredGettingUsers &&
              <ErrorMessage message={strings.GET_USERS_ERROR} />
            }

            <h3>Step 1: Select User</h3>
            <Dropdown
              id={ELEMENT_ID.MANAGE_CLIENT_USERS_DROPDOWN}
              placeholder="Username"
              options={userOptions}
              value={userId}
              onChange={this.onUserChanged}
              search
              selection
              selectOnBlur={false}
              clearable
            />

            <h3>Step 2: Search and Select Corresponding Client</h3>
            <Dropdown
              id={ELEMENT_ID.MANAGE_CLIENT_CLIENTS_DROPDOWN}
              placeholder={strings.TYPE_CLIENT_NAME}
              options={clientOptions}
              value={clientNumber}
              search
              selection
              loading={isFetchingClients}
              onChange={this.onClientChanged}
              onSearchChange={this.searchClientsWithDebounce}
              icon={<Icon name="search" size="small" />}
              noResultsMessage={noResultsMessage}
              selectOnBlur={false}
              clearable
            />

            <div className="manage-client__update-btn">
              <PrimaryButton
                loading={isUpdatingClientIdOfUser}
                onClick={this.openUpdateConfirmationModal}
                disabled={!isUpdateBtnEnabled}
                content="Submit"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ManageClient;
