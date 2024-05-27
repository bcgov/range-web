import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { Button } from '@material-ui/core';
import { RANGE_USE_PLAN } from '../../constants/routes';
import * as strings from '../../constants/strings';
import EditIcon from '@material-ui/icons/Edit';
import ViewIcon from '@material-ui/icons/Visibility';
import { Link } from 'react-router-dom';
import NewPlanMenuItem from './NewPlanMenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

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
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
