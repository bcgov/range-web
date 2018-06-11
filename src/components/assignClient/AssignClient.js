import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button, Icon } from 'semantic-ui-react';
import debounce from 'lodash.debounce';
import { Banner, ConfirmationModal } from '../common';
import {
  ASSIGN_CLIENT_BANNER_CONTENT, ASSIGN_CLIENT_BANNER_HEADER,
  // UPDATE_CONTACT_CONFIRMATION_CONTENT, UPDATE_CONTACT_CONFIRMATION_HEADER,
  // NOT_SELECTED, CONTACT_NO_EXIST,
} from '../../constants/strings';
import { ASSIGN_CLIENT_USERS_DROPDOWN_ELEMENT_ID, ASSIGN_CLIENT_CLIENTS_DROPDOWN_ELEMENT_ID } from '../../constants/variables';
import { User } from '../../models';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  getClients: PropTypes.func.isRequired,
  // isAssigning: PropTypes.bool.isRequired,
};

export class AssignClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // newContactId: null,
      // currContactName: null,
      userId: null,
      clientNumber: null,
      isUpdateModalOpen: false,
      startSearching: false,
    };
    this.searchClientsWithDebounce = debounce(this.handleSearchChange, 1000);
  }

  onUserChanged = (e, { value: userId }) => {
    this.setState({
      userId,
    });
  }

  onClientChanged = (e, { value: clientNumber }) => {
    this.setState({
      clientNumber,
    });
  }

  closeUpdateConfirmationModal = () => {
    this.setState({ isUpdateModalOpen: false });
  }

  openUpdateConfirmationModal = () => {
    this.setState({ isUpdateModalOpen: true });
  }

  handleSearchChange = (e, { searchQuery }) => {
    if (searchQuery) {
      this.props.getClients(searchQuery).then(this.setState({ startSearching: true }));
    }
  }
  assignUserToClient = () => {

  }
  render() {
    const {
      users,
      clients,
      isAssigning,
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
      const { clientNumber, locationCode, name } = c;
      return {
        key: clientNumber,
        value: clientNumber,
        text: name,
        description: locationCode,
      };
    });
    const isUpdateBtnEnabled = userId && clientNumber;

    return (
      <div className="assign-client">
        <ConfirmationModal
          open={isUpdateModalOpen}
          loading={isAssigning}
          header={"header"}
          content={"content"}
          onNoClicked={this.closeUpdateConfirmationModal}
          onYesClicked={this.assignUserToClient}
        />

        <Banner
          header={ASSIGN_CLIENT_BANNER_HEADER}
          content={ASSIGN_CLIENT_BANNER_CONTENT}
        />

        <div className="assign-client__content">
          <div className="assign-client__steps">
            <h3>Step 1: Select User</h3>
            <Dropdown
              id={ASSIGN_CLIENT_USERS_DROPDOWN_ELEMENT_ID}
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
              id={ASSIGN_CLIENT_CLIENTS_DROPDOWN_ELEMENT_ID}
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
                Assign User
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AssignClient.propTypes = propTypes;
export default AssignClient;
