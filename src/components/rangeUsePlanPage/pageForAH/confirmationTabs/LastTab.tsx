import React from 'react';
import { Icon } from 'semantic-ui-react';
import AHConfirmationList from './AHConfirmationList';
import { PrimaryButton } from '../../../common';

interface LastTabProps {
  user: any;
  plan: any;
  clients: any[];
  currTabId: string;
  onClose: () => void;
  tab: { id?: string; title?: string };
}

const LastTab: React.FC<LastTabProps> = ({ user, clients, plan, currTabId, tab, onClose }) => {
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
};

export default LastTab;
