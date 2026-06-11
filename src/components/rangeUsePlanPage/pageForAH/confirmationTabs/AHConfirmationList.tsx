import React from 'react';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';
import {
  findConfirmationWithClientNumber,
  formatDateFromServer,
  isClientCurrentUser,
  getClientFullName,
  isAgent,
  getUserFullName,
} from '../../../../utils';
import { AWAITING_CONFIRMATION, NO_USER_LINKED } from '../../../../constants/strings';

interface AHConfirmationListProps {
  user: any;
  clients: any[];
  plan: any;
  clientAgreements?: any[];
}

const AHConfirmationList: React.FC<AHConfirmationListProps> = ({ user, clients, plan, clientAgreements }) => {
  const renderConfirmation = (client: any, confirmation: any) => {
    const { confirmed, updatedAt } = confirmation || {};
    const confirmationDate = confirmed ? formatDateFromServer(updatedAt) : AWAITING_CONFIRMATION;

    return (
      <div key={client.clientNumber} className="rup__confirmation__ah-list">
        <div>
          <Icon name="user outline" />
          <span
            className={classnames('rup__confirmation__ah-list__cname', {
              'rup__confirmation__ah-list__cname--bold':
                isClientCurrentUser(client, user) ||
                (isAgent(clientAgreements, user, client) && confirmation?.user?.id === user?.id),
            })}
          >
            {getClientFullName(client)}{' '}
            {confirmed && !confirmation.isOwnSignature && `(by ${getUserFullName(confirmation.user)})`}
            {!client.email &&
              !clientAgreements?.find((ca: any) => ca.clientId === client.clientNumber)?.agent &&
              `(${NO_USER_LINKED})`}
          </span>
        </div>
        <div>{confirmationDate}</div>
      </div>
    );
  };

  const confirmedListView: React.ReactNode[] = [
    <div key="confirmed1" className="rup__confirmation__paragraph-title">
      Agreement holders who have confirmed the submission
    </div>,
    <div key="confirmed2" className="rup__confirmation__ah-list__columns">
      <span>Name</span>
      <span>Confirmation Date</span>
    </div>,
  ];
  const notConfirmedListView: React.ReactNode[] = [
    <div key="notConfirmed" className="rup__confirmation__paragraph-title">
      Agreement holders who have not yet confirmed the submission
    </div>,
  ];
  const allConfimedView = (
    <div key="allConfirmed" className="rup__confirmation__paragraph-title">
      All agreement holders have confirmed this submission. It has now been submitted to range staff.
    </div>
  );

  clients.map((client: any) => {
    const confirmation = findConfirmationWithClientNumber(client.id, plan.confirmations);
    const view = renderConfirmation(client, confirmation);
    if (confirmation && confirmation.confirmed) {
      return confirmedListView.push(view);
    }

    return notConfirmedListView.push(view);
  });

  const isAllConfirmed = notConfirmedListView.length === 1;

  let confirmationList: React.ReactNode[];
  if (isAllConfirmed) {
    confirmedListView.push(allConfimedView);
    confirmationList = confirmedListView;
  } else {
    confirmationList = confirmedListView.concat(notConfirmedListView);
  }

  return <div style={{ width: '100%' }}>{confirmationList}</div>;
};

export default AHConfirmationList;
