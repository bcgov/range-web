import React from 'react';
import { MenuItem } from '@material-ui/core';
import { axios, getAuthHeaderConfig, getDataFromLocalStorage } from '../../utils';
import useConfirm from '../../providers/ConfrimationModalProvider';
import * as API from '../../constants/api';
import { useToast } from '../../providers/ToastProvider';
import { useNavigate } from 'react-router-dom';

interface PastePlanMenuItemProps {
  destinationAgreementId: any;
  destinationPlanId?: any;
  menuText: string;
  confirmationPromptText: string;
  currentPage?: any;
  createReplacementPlan?: boolean;
}

const PastePlanMenuItem: React.FC<PastePlanMenuItemProps> = ({
  destinationAgreementId,
  destinationPlanId,
  menuText,
  confirmationPromptText,
  currentPage,
  createReplacementPlan,
}) => {
  const navigate = useNavigate();
  const { errorToast } = useToast();
  const confirm = useConfirm()!;
  const sourcePlan: any = getDataFromLocalStorage('copyPlanInfo');
  if (!sourcePlan?.agreementId) {
    return null;
  }
  return (
    <MenuItem
      onClick={async () => {
        if (!sourcePlan?.agreementId) {
          errorToast('You need to copy a plan.');
          return;
        }
        const choice = await confirm({
          contentText: confirmationPromptText,
        });
        if (choice) {
          try {
            const response = await axios.put(
              API.COPY_PLAN(sourcePlan.planId),
              {
                agreementId: destinationAgreementId,
                destinationPlanId: destinationPlanId,
                createReplacementPlan: createReplacementPlan,
              },
              getAuthHeaderConfig(),
            );
            navigate(`/range-use-plan/${response.data.planId}`, {
              state: {
                page: currentPage,
                prevSearch: location.search,
              },
            });
          } catch (e) {
            errorToast('Error creating plan');
            return;
          }
        }
      }}
    >
      {menuText}
    </MenuItem>
  );
};

export default PastePlanMenuItem;
