import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import RightBtn from '../RightBtn';
import AHConfirmationList from './AHConfirmationList';

class LastTab extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    plan: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    confirmationsMap: PropTypes.shape({}).isRequired,
    currTabId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
  }

  render() {
    const {
      user,
      clients,
      plan,
      confirmationsMap,
      currTabId,
      tab,
      onClose,
    } = this.props;
    const { id, title } = tab;
    const isActive = id === currTabId;

    if (!isActive) {
      return null;
    }

    return (
      <div className="rup__multi-tab__last">
        <Icon
          style={{ marginBottom: '10px' }}
          name="check circle outline"
          size="huge"
        />

        <div className="rup__multi-tab__last__title">
          {title}
        </div>

        <AHConfirmationList
          user={user}
          clients={clients}
          plan={plan}
          confirmationsMap={confirmationsMap}
        />

        <RightBtn
          primary
          onClick={onClose}
          content="Finish"
        />
      </div>
    );
  }
}

export default LastTab;
