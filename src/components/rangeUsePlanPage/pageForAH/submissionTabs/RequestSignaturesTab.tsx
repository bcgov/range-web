import React from 'react';
import classnames from 'classnames';
import { MuiIcon } from '../../../common';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';
import { isClientCurrentUser, getClientFullName } from '../../../../utils';

interface RequestSignaturesTabProps {
  currTabId: string;
  isSubmitting: boolean;
  handleTabChange: (...args: any[]) => void;
  onSubmitClicked: (...args: any[]) => any;
  clients: any[];
  clientAgreements: any[];
  user: any;
  tab: { id: string; title: string; back: string; next: string; text1: string; text2: string; text3: string };
}

function RequestSignaturesTab({
  currTabId,
  tab,
  isSubmitting,
  clients,
  user,
  clientAgreements,
  handleTabChange,
  onSubmitClicked,
}: RequestSignaturesTabProps) {
  const { id, title, text1, text2, text3 } = tab;
  const isActive = id === currTabId;

  if (!isActive) {
    return null;
  }

  const onBackClicked = (e: any) => {
    handleTabChange(e, { value: tab.back });
  };

  const handleSubmit = (e: any) => {
    onSubmitClicked(e).then(() => {
      handleTabChange(e, { value: tab.next });
    });
  };

  const renderAgreementHolder = (client: any) => {
    const agencyAgreements = clientAgreements.filter((a: any) => a.agentId === user.id);
    const isAgent = !!agencyAgreements.find((ca: any) => ca.clientId === client.clientNumber);

    return (
      <div key={client.clientNumber} className="rup__multi-tab__ah-list">
        <MuiIcon name="user outline" />
        <span
          className={classnames('rup__multi-tab__ah-list__cname', {
            'rup__multi-tab__ah-list__cname--bold': isClientCurrentUser(client, user) || isAgent,
          })}
        >
          {getClientFullName(client)}
          {isClientCurrentUser(client, user) && ' (in progress)'}
          {isAgent && ' (signing for as agent)'}
        </span>
      </div>
    );
  };

  return (
    <TabTemplate
      isActive={isActive}
      title={title}
      actions={
        <>
          <LeftBtn onClick={onBackClicked} content="Back" />
          <RightBtn onClick={handleSubmit} loading={isSubmitting} content="Request eSignatures and Submit" />
        </>
      }
      content={
        <div>
          <div style={{ marginBottom: '20px' }}>{text1}</div>
          <div style={{ marginBottom: '20px' }}>{text2}</div>
          <div className="rup__multi-tab__ah-list__header">{text3}</div>
          {clients.map(renderAgreementHolder)}
        </div>
      }
    />
  );
}

export default RequestSignaturesTab;
