import { Button } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import ViewIcon from '@material-ui/icons/Visibility';
import React from 'react';
import { Link } from 'react-router-dom';
import { RANGE_USE_PLAN } from '../../constants/routes';
import * as strings from '../../constants/strings';
import { PLAN_EXTENSION_STATUS } from '../../constants/variables';
import CreateExtensionPlan from './CreateExtensionPlan';
import NewPlanMenuItem from './NewPlanMenuItem';

export default function PlanActions({
  agreement,
  planId,
  canEdit,
  canCreatePlan,
  currentPage,
}) {
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
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 1 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  {planId && (
                    <MenuItem
                      fullWidth
                      variant="outlined"
                      component={Link}
                      to={{
                        pathname: `${RANGE_USE_PLAN}/${planId}`,
                        state: {
                          page: currentPage,
                          prevSearch: location.search,
                        },
                      }}
                    >
                      {canEdit ? (
                        <>
                          <EditIcon fontSize="small" />
                          {strings.EDIT}
                        </>
                      ) : (
                        <>
                          <ViewIcon fontSize="small" />
                          {strings.VIEW}
                        </>
                      )}
                    </MenuItem>
                  )}
                  {canCreatePlan && !planId && (
                    <NewPlanMenuItem agreement={agreement} />
                  )}
                  {[
                    PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED,
                    PLAN_EXTENSION_STATUS.STAFF_REJECTED,
                    PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED,
                  ].includes(agreement.plan?.extensionStatus) && (
                    <CreateExtensionPlan planId={planId} />
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
