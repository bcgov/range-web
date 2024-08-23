import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import AHConfirmationList from './AHConfirmationList';
import { PrimaryButton } from '../../../common';

class LastTab extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    plan: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    currTabId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
  };

  render() {
    const { user, clients, plan, currTabId, tab, onClose } = this.props;
    const { id, title } = tab;
    const isActive = id === currTabId;

    if (!isActive) {
      return null;
    }

    return (
      <div className="rup__multi-tab__last">
        <Icon style={{ marginBottom: '10px' }} name="check circle outline" size="huge" color="green" />

        <div className="rup__multi-tab__last__title">{title}</div>

        <AHConfirmationList user={user} clients={clients} plan={plan} />

        <PrimaryButton onClick={onClose} content="Ok" style={{ marginTop: '15px' }} />
      </div>
    );
  }
}

export default LastTab;
