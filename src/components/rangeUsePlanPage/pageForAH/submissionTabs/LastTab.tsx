import React from 'react';
import { Icon } from 'semantic-ui-react';
import RightBtn from '../tab/RightBtn';

interface LastTabProps {
  currTabId: string;
  onClose: () => void;
  tab: { id: string; title: string; text1?: string; text2?: string };
}

function LastTab({ currTabId, tab, onClose }: LastTabProps) {
  const { id, title, text1, text2 } = tab;
  const isActive = id === currTabId;

  if (!isActive) {
    return null;
  }

  return (
    <div className="rup__multi-tab__last">
      <Icon style={{ marginBottom: '10px' }} name="check circle outline" size="huge" color="green" />
      <div className="rup__multi-tab__last__title">{title}</div>
      <div style={{ marginBottom: '20px' }}>{text1}</div>
      {text2 && <div style={{ marginBottom: '20px' }}>{text2}</div>}
      <RightBtn onClick={onClose} content="Ok" />
    </div>
  );
}

export default LastTab;
