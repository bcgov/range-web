import React from 'react';
import { MenuItem } from '@material-ui/core';
import {
  axios,
  getAuthHeaderConfig,
  getDataFromLocalStorage,
} from '../../utils';
import useConfirm from '../../providers/ConfrimationModalProvider';
import { PLAN_PASTE_CONFIRMATION_QUESTION } from '../../constants/strings';
import * as API from '../../constants/api';
import { useToast } from '../../providers/ToastProvider';
import { useHistory } from 'react-router-dom';

const PastePlanMenuItem = ({ agreementId, menuText, currentPage }) => {
  const history = useHistory();
  const { errorToast } = useToast();
  const confirm = useConfirm();
  const sourcePlan = getDataFromLocalStorage('copyPlanInfo');
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
          contentText: PLAN_PASTE_CONFIRMATION_QUESTION(
            sourcePlan.agreementId,
            agreementId,
          ),
        });
        if (choice) {
          try {
            const response = await axios.put(
              API.COPY_PLAN(sourcePlan.planId, agreementId),
              {},
              getAuthHeaderConfig(),
            );
            history.push({
              pathname: `/range-use-plan/${response.data.planId}`,
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
