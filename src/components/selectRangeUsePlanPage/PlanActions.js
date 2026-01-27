import { Button } from '@material-ui/core';
import CreateExemptionMenuItem from './CreateExemptionMenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import React from 'react';
import * as strings from '../../constants/strings';
import { PLAN_EXTENSION_STATUS, PLAN_STATUS } from '../../constants/variables';
import { getDataFromLocalStorage, isPlanActive, isUserAgreementHolder } from '../../utils';
import { isUserAdmin, isUserAgrologist } from '../../utils/helper/user';
import CopyPlanMenuItem from './CopyPlanMenuItem';
import CreateReplacementPlan from './CreateReplacementPlan';
import NewPlanMenuItem from './NewPlanMenuItem';
import PastePlanMenuItem from './PastePlanMenuItem';
import ViewPlanMenuItem from './ViewPlanMenuItem';

export default function PlanActions({
  agreement,
  user,
  planId,
  canEdit,
  canCreatePlan,
  currentPage,
  onOpenExemptionDialog,
}) {
  const isStaffAgrologistOrAdmin = isUserAdmin(user) || isUserAgrologist(user);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleToggle}
        ref={anchorRef}
        endIcon={<KeyboardArrowDown />}
      >
        Actions
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 1 }}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  {isStaffAgrologistOrAdmin && <CreateExemptionMenuItem onClick={onOpenExemptionDialog} />}
                  {planId && (
                    <ViewPlanMenuItem
                      planId={planId}
                      currentPage={currentPage}
                      menuText={canEdit ? strings.EDIT : strings.VIEW}
                    />
                  )}
                  {planId && (
                    <CopyPlanMenuItem
                      handleClose={handleClose}
                      planId={planId}
                      agreementId={agreement.id}
                      menuText={'Copy'}
                    />
                  )}
                  {canCreatePlan && !planId && <NewPlanMenuItem agreement={agreement} />}
                  {canCreatePlan && !planId && (
                    <PastePlanMenuItem
                      destinationAgreementId={agreement.id}
                      menuText={'Paste'}
                      currentPage={currentPage}
                      confirmationPromptText={strings.PLAN_PASTE_CONFIRMATION_QUESTION(
                        getDataFromLocalStorage('copyPlanInfo')?.agreementId,
                        agreement.id,
                      )}
                    />
                  )}
                  {canCreatePlan &&
                    planId &&
                    !isPlanActive(agreement.plan) &&
                    getDataFromLocalStorage('copyPlanInfo')?.agreementId !== agreement.id && (
                      <PastePlanMenuItem
                        destinationAgreementId={agreement.id}
                        destinationPlanId={agreement?.plan.id}
                        menuText={'Paste & Replace'}
                        currentPage={currentPage}
                        confirmationPromptText={strings.PLAN_PASTE_REPLACE_CONFIRMATION_QUESTION(
                          getDataFromLocalStorage('copyPlanInfo')?.agreementId,
                          agreement.id,
                        )}
                      />
                    )}
                  {!isUserAgreementHolder(user) &&
                    ([
                      PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED,
                      PLAN_EXTENSION_STATUS.STAFF_REJECTED,
                      PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED,
                    ].includes(agreement.plan?.extensionStatus) ||
                      (agreement.plan?.status.code === PLAN_STATUS.EXPIRED &&
                        ![
                          PLAN_EXTENSION_STATUS.REPLACEMENT_PLAN_CREATED,
                          PLAN_EXTENSION_STATUS.REPLACED_WITH_REPLACEMENT_PLAN,
                          PLAN_EXTENSION_STATUS.ACTIVE_REPLACEMENT_PLAN,
                        ].includes(agreement.plan?.extensionStatus))) && <CreateReplacementPlan planId={planId} />}
                  {[
                    PLAN_EXTENSION_STATUS.REPLACEMENT_PLAN_CREATED,
                    PLAN_EXTENSION_STATUS.REPLACED_WITH_REPLACEMENT_PLAN,
                  ].includes(agreement.plan?.extensionStatus) && (
                    <ViewPlanMenuItem
                      planId={agreement.plan?.replacementPlanId}
                      currentPage={currentPage}
                      menuText={'View Replacement Plan'}
                    />
                  )}
                  {[PLAN_EXTENSION_STATUS.ACTIVE_REPLACEMENT_PLAN].includes(agreement.plan?.extensionStatus) && (
                    <ViewPlanMenuItem
                      planId={agreement.plan?.replacementOf}
                      currentPage={currentPage}
                      menuText={'View Original Plan'}
                    />
                  )}
                  {[
                    PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED,
                    PLAN_EXTENSION_STATUS.STAFF_REJECTED,
                    PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED,
                    PLAN_EXTENSION_STATUS.REPLACEMENT_PLAN_CREATED,
                  ].includes(agreement.plan?.extensionStatus) && (
                    <PastePlanMenuItem
                      destinationAgreementId={agreement.id}
                      destinationPlanId={agreement?.plan?.id}
                      menuText={'Paste As Replacement Plan'}
                      currentPage={currentPage}
                      createReplacementPlan={true}
                      confirmationPromptText={strings.PLAN_PASTE_AS_REPLACEMENT_PLAN_CONFIRMATION_QUESTION(
                        getDataFromLocalStorage('copyPlanInfo')?.agreementId,
                        agreement.id,
                      )}
                    />
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
