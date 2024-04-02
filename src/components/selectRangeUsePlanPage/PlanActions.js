import React, { useEffect } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { RANGE_USE_PLAN } from '../../constants/routes';
import * as strings from '../../constants/strings';
import EditIcon from '@material-ui/icons/Edit';
import ViewIcon from '@material-ui/icons/Visibility';
import { Link } from 'react-router-dom';
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

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <MoreVert />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ zIndex: 1 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              boxShadow: '1px 1px 5px 1px grey',
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
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
                      endIcon={canEdit ? <EditIcon /> : <ViewIcon />}
                    >
                      {canEdit ? 'Edit' : strings.VIEW}
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
