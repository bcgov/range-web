import React from 'react';
import { MuiIcon , PrimaryButton } from '../../../common';
import AHConfirmationList from './AHConfirmationList';

interface LastTabProps {
  user: any;
  plan: any;
  clients: any[];
  currTabId: string;
  onClose: () => void;
  tab: { id?: string; title?: string };
}

function LastTab({ user, clients, plan, currTabId, tab, onClose }: LastTabProps) {
  const { id, title } = tab;
  const isActive = id === currTabId;

  if (!isActive) {
    return null;
  }

  return (
    <div className="rup__multi-tab__last">
      <MuiIcon style={{ marginBottom: '10px' }} name="check circle outline" size="huge" color="green" />

      <div className="rup__multi-tab__last__title">{title}</div>

      <AHConfirmationList user={user} clients={clients} plan={plan} />

      <PrimaryButton onClick={onClose} content="Ok" style={{ marginTop: '15px' }} />
    </div>
  );
}

export default LastTab;
