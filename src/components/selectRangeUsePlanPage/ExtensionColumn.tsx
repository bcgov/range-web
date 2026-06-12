import { Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import React, { useState } from 'react';
import { PrimaryButton } from '../common';
import { ThumbDown, ThumbUp } from '@material-ui/icons';
import moment from 'moment';
import {
  axios,
  doesStaffOwnPlan,
  getAuthHeaderConfig,
  isUserAgreementHolder,
  isUserDecisionMaker,
  isUserStaff,
} from '../../utils';
import { useNavigate } from 'react-router-dom';
import * as API from '../../constants/api';
import DatePickerDialog from './DatePickerDialog';
import { PLAN_EXTENSION_STATUS } from '../../constants/variables';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { PLAN_EXTENSION_CONFIRMATION_QUESTION } from '../../constants/strings';
import useConfirm from '../../providers/ConfrimationModalProvider';

interface ExtensionColumnProps {
  user: any;
  currentPage: any;
  agreement: any;
}

export default function ExtensionColumn({ user, currentPage, agreement }: ExtensionColumnProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [futureDate, setFutureDate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const confirm = useConfirm()!;

  const getPlanFutureDate = (planEndDate: any) => {
    if (isNaN(Date.parse(planEndDate))) planEndDate = new Date();
    const futureEndDate = new Date(planEndDate);
    futureEndDate.setFullYear(futureEndDate.getFullYear() + 5);
    return moment(futureEndDate).format('YYYY-MM-DD');
  };

  const recommendExtension = async (planId: any) => {
    setLoading(true);
    const response = await axios.put(API.REQUEST_EXTENSION(planId), {}, getAuthHeaderConfig());
    if (response.status === 200) {
      agreement.plan.extensionStatus = PLAN_EXTENSION_STATUS.AWAITING_EXTENSION;
    }
    setLoading(false);
  };

  const handleRecommend = async (planId: any) => {
    const choice = await confirm({
      contentText: PLAN_EXTENSION_CONFIRMATION_QUESTION('recommend'),
    });
    if (choice) {
      recommendExtension(planId);
    }
  };

  const extendPlan = async (planId: any, _futureDate?: any) => {
    setLoading(true);
    const response = await axios.put(API.EXTEND_PLAN(planId, futureDate as any), {}, getAuthHeaderConfig());
    setLoading(false);
    navigate(`/range-use-plan/${response.data.planId}`, {
      state: {
        page: currentPage,
        prevSearch: location.search,
      },
    });
  };

  const approveExtension = async (planId: any, extensionRequestId: any, pendingRequestIds: any[]) => {
    setVoting(true);
    try {
      await axios.put(API.APPROVE_VOTE(planId), { extensionRequestId }, getAuthHeaderConfig());
      // Update local state ONLY for the pending requests associated with this user
      const newPlanExtensionRequests = agreement.plan.planExtensionRequests.map((req: any) => {
        if (pendingRequestIds.includes(req.id)) {
          return { ...req, requestedExtension: true };
        }
        return req;
      });
      agreement.plan.planExtensionRequests = newPlanExtensionRequests;
      agreement.plan.extensionReceivedVotes += pendingRequestIds.length;
    } catch (error) {
      console.error('Error approving extensions:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleApprove = async (planId: any, extensionRequestId: any, pendingRequestIds: any[]) => {
    const choice = await confirm({
      contentText: PLAN_EXTENSION_CONFIRMATION_QUESTION('approve'),
    });
    if (choice) {
      approveExtension(planId, extensionRequestId, pendingRequestIds);
    }
  };

  const rejectExtension = async (planId: any, extensionRequestId: any, pendingRequestIds: any[]) => {
    setVoting(true);
    try {
      const response = await axios.put(API.REJECT_VOTE(planId), { extensionRequestId }, getAuthHeaderConfig());
      agreement.plan.extensionStatus = response.data.extensionStatus;
      // Update local state ONLY for the pending requests associated with this user
      const newPlanExtensionRequests = agreement.plan.planExtensionRequests.map((req: any) => {
        if (pendingRequestIds?.includes(req.id)) {
          return { ...req, requestedExtension: false };
        }
        return req;
      });
      agreement.plan.planExtensionRequests = newPlanExtensionRequests;
    } catch (error) {
      console.error('Error rejecting extensions:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleReject = async (planId: any, extensionRequestId?: any, pendingRequestIds?: any[]) => {
    const choice = await confirm({
      contentText: PLAN_EXTENSION_CONFIRMATION_QUESTION('reject'),
    });
    if (choice) {
      rejectExtension(planId, extensionRequestId, pendingRequestIds as any[]);
    }
  };

  const renderExtensionForDecisionMaker = (user: any, agreement: any) => {
    if (isUserDecisionMaker(user)) {
      switch (agreement.plan?.extensionStatus) {
        case PLAN_EXTENSION_STATUS.AWAITING_VOTES:
          return (
            <div>
              <div style={{ textAlign: 'center' }}>
                {agreement.plan?.extensionReceivedVotes}/{agreement.plan?.extensionRequiredVotes}
              </div>
              <div>
                <Button
                  variant="outlined"
                  style={{ margin: '4px' }}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size="1em" color="inherit" /> : undefined}
                  onClick={() => {
                    handleReject(agreement.plan.id);
                  }}
                >
                  Reject Extension
                </Button>
              </div>
            </div>
          );
        case PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED:
          return <div>Agreement Holder Rejected</div>;
        case PLAN_EXTENSION_STATUS.STAFF_REJECTED:
          return <div>Staff Rejected</div>;
        case PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED:
          return <div>District Manager Rejected</div>;
        case PLAN_EXTENSION_STATUS.REPLACEMENT_PLAN_CREATED:
          return <div>Replacement Plan Created</div>;
        case PLAN_EXTENSION_STATUS.REPLACED_WITH_REPLACEMENT_PLAN:
          return <div>Replaced</div>;
        case PLAN_EXTENSION_STATUS.ACTIVE_REPLACEMENT_PLAN:
          return <div>Replacement Plan</div>;
        case PLAN_EXTENSION_STATUS.AWAITING_EXTENSION:
          if (agreement.plan?.extensionReceivedVotes >= agreement.plan?.extensionRequiredVotes) {
            return (
              <>
                <PrimaryButton
                  style={{ margin: '4px' }}
                  loading={loading}
                  onClick={() => {
                    setFutureDate(getPlanFutureDate(agreement.plan?.planEndDate));
                    setDialogOpen(true);
                  }}
                >
                  Approve Extension
                </PrimaryButton>
                <Button
                  variant="outlined"
                  style={{ margin: '4px' }}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size="1em" color="inherit" /> : undefined}
                  onClick={() => {
                    handleReject(agreement.plan.id);
                  }}
                >
                  Reject Extension
                </Button>
              </>
            );
          }
          return (
            <div>
              {agreement.plan?.extensionReceivedVotes}/{agreement.plan?.extensionRequiredVotes}
            </div>
          );
        case PLAN_EXTENSION_STATUS.EXTENDED:
          return (
            <div>
              Extended
              <div>
                {agreement.plan?.extensionDate ? moment(agreement.plan?.extensionDate).format('MMM DD YYYY') : ''}
              </div>
            </div>
          );
        case PLAN_EXTENSION_STATUS.IS_EXTENSION:
          return <div>Is Extension</div>;
        default:
          return <div>-</div>;
      }
    }
  };

  const renderExtensionForStaff = (user: any, agreement: any) => {
    if (isUserStaff(user)) {
      switch (agreement.plan?.extensionStatus) {
        case PLAN_EXTENSION_STATUS.AWAITING_VOTES:
          if (
            doesStaffOwnPlan({ ...agreement.plan, agreement }, user) &&
            agreement.plan?.extensionReceivedVotes >= agreement.plan?.extensionRequiredVotes
          ) {
            return (
              <>
                <PrimaryButton
                  size="small"
                  style={{ margin: '4px' }}
                  loading={loading}
                  onClick={() => handleRecommend(agreement.plan.id)}
                >
                  Forward Extension
                  <br />
                  For Decision
                </PrimaryButton>
              </>
            );
          }
          return (
            <div>
              <div style={{ textAlign: 'center' }}>
                {agreement.plan?.extensionReceivedVotes}/{agreement.plan?.extensionRequiredVotes}
              </div>
              <div>
                <Button
                  variant="outlined"
                  style={{ margin: '4px' }}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size="1em" color="inherit" /> : undefined}
                  onClick={() => {
                    handleReject(agreement.plan.id);
                  }}
                >
                  Reject Extension
                </Button>
              </div>
            </div>
          );
        case PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED:
          return <div>Agreement Holder Rejected</div>;
        case PLAN_EXTENSION_STATUS.STAFF_REJECTED:
          return <div>Staff Rejected</div>;
        case PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED:
          return <div>District Manager Rejected</div>;
        case PLAN_EXTENSION_STATUS.AWAITING_EXTENSION:
          return <div>Awaiting Extension</div>;
        case PLAN_EXTENSION_STATUS.REPLACEMENT_PLAN_CREATED:
          return <div>Replacement Plan Created</div>;
        case PLAN_EXTENSION_STATUS.REPLACED_WITH_REPLACEMENT_PLAN:
          return <div>Replaced</div>;
        case PLAN_EXTENSION_STATUS.ACTIVE_REPLACEMENT_PLAN:
          return <div>Replacement Plan</div>;
        case PLAN_EXTENSION_STATUS.EXTENDED:
          return (
            <div>
              Extended
              <div>
                {agreement.plan?.extensionDate ? moment(agreement.plan?.extensionDate).format('MMM DD YYYY') : ''}
              </div>
            </div>
          );
        case PLAN_EXTENSION_STATUS.IS_EXTENSION:
          return <div>Is Extension</div>;
        default:
          return <div>-</div>;
      }
    }
  };

  const renderExtensionForAgreementHolder = (user: any, agreement: any) => {
    const extensionRequests: any[] = [];
    if (agreement.plan?.planExtensionRequests) {
      const ownRequests = agreement.plan.planExtensionRequests.filter((request: any) => request.userId === user.id);
      extensionRequests.push(...ownRequests);

      if (user.agentOf && user.agentOf.length > 0) {
        const agentClientIds = user.agentOf.map((agent: any) => agent.clientId);

        const agentExtensionRequests = agreement.plan.planExtensionRequests.filter((request: any) =>
          agentClientIds.includes(request.clientId),
        );
        extensionRequests.push(...agentExtensionRequests);
      }
    }

    const uniqueExtensionRequests = Array.from(new Map(extensionRequests.map((item) => [item.id, item])).values());

    if ((isUserAgreementHolder(user) || uniqueExtensionRequests.length > 0) && !isUserDecisionMaker(user)) {
      switch (agreement.plan?.extensionStatus) {
        case PLAN_EXTENSION_STATUS.AWAITING_VOTES: {
          const pendingRequests = uniqueExtensionRequests.filter((req: any) => req.requestedExtension === null);
          const nonPendingRequests = uniqueExtensionRequests.filter((req: any) => req.requestedExtension !== null);

          if (pendingRequests.length > 0) {
            const firstPendingRequestId = pendingRequests[0].id;
            const pendingRequestIds = pendingRequests.map((req: any) => req.id);
            if (voting) {
              return <CircularProgress key="voting-spinner" />;
            } else {
              return (
                <React.Fragment key="action-buttons">
                  <Tooltip title="approve">
                    <IconButton
                      onClick={() => handleApprove(agreement.plan.id, firstPendingRequestId, pendingRequestIds)}
                    >
                      <ThumbUp />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="reject">
                    <IconButton
                      onClick={() => handleReject(agreement.plan.id, firstPendingRequestId, pendingRequestIds)}
                    >
                      <ThumbDown />
                    </IconButton>
                  </Tooltip>
                </React.Fragment>
              );
            }
          } else if (nonPendingRequests.length > 0) {
            return <div key="requested">Requested</div>;
          } else {
            return <div key="no-requests">-</div>;
          }
        }
        case PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED:
          return <div>Agreement Holder Rejected</div>;
        case PLAN_EXTENSION_STATUS.STAFF_REJECTED:
          return <div>Staff Rejected</div>;
        case PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED:
          return <div>District Manager Rejected</div>;
        case PLAN_EXTENSION_STATUS.AWAITING_EXTENSION:
          return <div>Awaiting Extension</div>;
        case PLAN_EXTENSION_STATUS.REPLACEMENT_PLAN_CREATED:
          return <div>Replacement Plan Created</div>;
        case PLAN_EXTENSION_STATUS.REPLACED_WITH_REPLACEMENT_PLAN:
          return <div>Replaced</div>;
        case PLAN_EXTENSION_STATUS.ACTIVE_REPLACEMENT_PLAN:
          return <div>Replacement Plan</div>;
        case PLAN_EXTENSION_STATUS.EXTENDED:
          return (
            <div>
              Extended
              <div>
                {agreement.plan?.extensionDate ? moment(agreement.plan?.extensionDate).format('MMM DD YYYY') : ''}
              </div>
            </div>
          );
        case PLAN_EXTENSION_STATUS.IS_EXTENSION:
          return <div>Is Extension</div>;
        default:
          return <div>-</div>;
      }
    }
  };

  return (
    <>
      {renderExtensionForStaff(user, agreement)}
      {renderExtensionForDecisionMaker(user, agreement)}
      {renderExtensionForAgreementHolder(user, agreement)}
      <DatePickerDialog
        defaultValue={getPlanFutureDate(agreement.plan?.planEndDate)}
        title="Select end date"
        inputProps={{
          min: moment(agreement.plan?.planEndDate).format('YYYY-MM-DD'),
        }}
        open={dialogOpen}
        setOpen={setDialogOpen}
        selectedDate={setFutureDate}
        actionName="Extend"
        callBack={() => {
          extendPlan(agreement.plan.id, futureDate);
        }}
      />
    </>
  );
}
