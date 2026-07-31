/* eslint-env jest */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ExtensionColumn from './ExtensionColumn';
import { ConfirmationModalProvider } from '../../providers/ConfrimationModalProvider';
import { PLAN_EXTENSION_STATUS } from '../../constants/variables';

const staffUser = { id: 5, roleId: 3 };

const buildAgreement = ({ votesReceived, votesRequired }) => ({
  zone: { user: { id: staffUser.id } },
  plan: {
    id: 1,
    extensionStatus: PLAN_EXTENSION_STATUS.AWAITING_VOTES,
    extensionReceivedVotes: votesReceived,
    extensionRequiredVotes: votesRequired,
    planEndDate: '2026-06-30',
    planExtensionRequests: [],
  },
});

const renderExtensionColumn = (agreement) =>
  render(
    <MemoryRouter>
      <ConfirmationModalProvider>
        <ExtensionColumn user={staffUser} currentPage={1} agreement={agreement} />
      </ConfirmationModalProvider>
    </MemoryRouter>,
  );

describe('ExtensionColumn for staff', () => {
  it('shows Reject Extension alongside Forward Extension when all agreement holders have voted yes', () => {
    renderExtensionColumn(buildAgreement({ votesReceived: 2, votesRequired: 2 }));

    expect(screen.getByText(/Forward Extension/)).toBeInTheDocument();
    expect(screen.getByText('Reject Extension')).toBeInTheDocument();
  });

  it('keeps showing Reject Extension when votes are incomplete', () => {
    renderExtensionColumn(buildAgreement({ votesReceived: 1, votesRequired: 2 }));

    expect(screen.queryByText(/Forward Extension/)).not.toBeInTheDocument();
    expect(screen.getByText('Reject Extension')).toBeInTheDocument();
  });
});
