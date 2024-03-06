import { CircularProgress, Tooltip } from '@material-ui/core';
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
import { useHistory } from 'react-router-dom';
import * as API from '../../constants/api';
import DatePickerDialog from './DatePickerDialog';
import { PLAN_EXTENSION_STATUS } from '../../constants/variables';
import { Button } from 'formik-semantic-ui';

export default function ExtensionColumn({ user, currentPage, agreement }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [futureDate, setFutureDate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getPlanFutureDate = (planEndDate) => {
    if (isNaN(Date.parse(planEndDate))) planEndDate = new Date();
    const futureEndDate = new Date(planEndDate);
    futureEndDate.setFullYear(futureEndDate.getFullYear() + 5);
    return moment(futureEndDate).format('YYYY-MM-DD');
  };

  const requestExtension = async (planId) => {
    setLoading(true);
    const response = await axios.put(
      API.REQUEST_EXTENSION(planId),
      {},
      getAuthHeaderConfig(),
    );
    if (response.status === 200) {
      agreement.plan.extensionStatus = PLAN_EXTENSION_STATUS.AWAITING_EXTENSION;
    }
    setLoading(false);
  };
  const extendPlan = async (planId) => {
    setLoading(true);
    const response = await axios.put(
      API.EXTEND_PLAN(planId, futureDate),
      {},
      getAuthHeaderConfig(),
    );
    setLoading(false);
    history.push({
      pathname: `/range-use-plan/${response.data.planId}`,
      state: {
        page: currentPage,
        prevSearch: location.search,
      },
    });
  };

  const handleApprove = async (planId) => {
    setVoting(true);
    const response = await axios.put(
      API.APPROVE_PLAN_EXTENSION(planId),
      {},
      getAuthHeaderConfig(),
    );
    if (response.status === 200) {
      agreement.plan.requestedExtension = true;
    }
    setVoting(false);
  };

  const handleReject = async (planId) => {
    setVoting(true);
    const response = await axios.put(
      API.REJECT_PLAN_EXTENSION(planId),
      {},
      getAuthHeaderConfig(),
    );
    if (response.status === 200) {
      agreement.plan.extensionStatus = response.data.extensionStatus;
      agreement.plan.requestedExtension = false;
    }
    setVoting(false);
  };

  const renderExtensionForDecisionMaker = (user, agreement) => {
    if (isUserDecisionMaker(user)) {
      switch (agreement.plan?.extensionStatus) {
        case PLAN_EXTENSION_STATUS.AWAITING_VOTES:
          return (
            <div>
              {agreement.plan?.extensionReceivedVotes}/
              {agreement.plan?.extensionRequiredVotes}
            </div>
          );
        case PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED:
          return <div>Agreement Holder Rejected</div>;
        case PLAN_EXTENSION_STATUS.STAFF_REJECTED:
          return <div>Staff Rejected</div>;
        case PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED:
          return <div>District Manager Rejected</div>;
        case PLAN_EXTENSION_STATUS.AWAITING_EXTENSION:
          if (
            agreement.plan?.extensionReceivedVotes ===
            agreement.plan?.extensionRequiredVotes
          ) {
            return (
              <>
                <PrimaryButton
                  style={{ margin: '4px' }}
                  loading={loading}
                  onClick={() => {
                    setFutureDate(
                      getPlanFutureDate(agreement.plan?.planEndDate),
                    );
                    setDialogOpen(true);
                  }}
                >
                  Approve Extension
                </PrimaryButton>
                <Button
                  style={{ margin: '4px' }}
                  loading={loading}
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
              {agreement.plan?.extensionReceivedVotes}/
              {agreement.plan?.extensionRequiredVotes}
            </div>
          );
        case PLAN_EXTENSION_STATUS.EXTENDED:
          return (
            <div>
              Extended
              <div>
                {agreement.plan?.extensionDate
                  ? moment(agreement.plan?.extensionDate).format('MMM DD YYYY')
                  : ''}
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

  const renderExtensionForStaff = (user, agreement) => {
    if (isUserStaff(user)) {
      switch (agreement.plan?.extensionStatus) {
        case PLAN_EXTENSION_STATUS.AWAITING_VOTES:
          if (
            doesStaffOwnPlan({ ...agreement.plan, agreement }, user) &&
            agreement.plan?.extensionReceivedVotes ===
              agreement.plan?.extensionRequiredVotes
          ) {
            return (
              <>
                <PrimaryButton
                  style={{ margin: '4px' }}
                  loading={loading}
                  onClick={() => requestExtension(agreement.plan.id)}
                >
                  Recommend Extension
                </PrimaryButton>
                <Button
                  style={{ margin: '4px' }}
                  loading={loading}
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
              {agreement.plan?.extensionReceivedVotes}/
              {agreement.plan?.extensionRequiredVotes}
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
        case PLAN_EXTENSION_STATUS.EXTENDED:
          return (
            <div>
              Extended
              <div>
                {agreement.plan?.extensionDate
                  ? moment(agreement.plan?.extensionDate).format('MMM DD YYYY')
                  : ''}
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

  const renderExtensionForAgreementHolder = (user, agreement) => {
    if (isUserAgreementHolder(user) && !isUserDecisionMaker(user)) {
      switch (agreement.plan?.extensionStatus) {
        case PLAN_EXTENSION_STATUS.AWAITING_VOTES:
          if (agreement.plan?.requestedExtension === null) {
            if (voting === true) return <CircularProgress />;
            return (
              <>
                <Tooltip title="approve">
                  <IconButton onClick={() => handleApprove(agreement.plan.id)}>
                    <ThumbUp />
                  </IconButton>
                </Tooltip>
                <Tooltip title="reject">
                  <IconButton onClick={() => handleReject(agreement.plan.id)}>
                    <ThumbDown />
                  </IconButton>
                </Tooltip>
              </>
            );
          } else {
            if (agreement.plan?.requestedExtension === true)
              return <>Requested</>;
            return <>Rejected</>;
          }
        case PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED:
          return <div>Agreement Holder Rejected</div>;
        case PLAN_EXTENSION_STATUS.STAFF_REJECTED:
          return <div>Staff Rejected</div>;
        case PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED:
          return <div>District Manager Rejected</div>;
        case PLAN_EXTENSION_STATUS.AWAITING_EXTENSION:
          return <div>Awaiting Extension</div>;
        case PLAN_EXTENSION_STATUS.EXTENDED:
          return (
            <div>
              Extended
              <div>
                {agreement.plan?.extensionDate
                  ? moment(agreement.plan?.extensionDate).format('MMM DD YYYY')
                  : ''}
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
