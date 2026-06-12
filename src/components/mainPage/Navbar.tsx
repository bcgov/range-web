import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, MuiIcon } from '../common';
import * as Routes from '../../constants/routes';
import { IMAGE_SRC, ELEMENT_ID } from '../../constants/variables';
import { canManageClients, canManageEmails, canAssignRoles, signOutFromSSOAndSiteMinder } from '../../utils';
import { signOut } from '../../actionCreators';
import {
  SELECT_RUP,
  MANAGE_CLIENTS,
  MERGE_ACCOUNT,
  EMAIL_TEMPLATE,
  ASSIGN_ROLES_AND_DISTRICTS,
} from '../../constants/strings';
import { AppDispatch } from '../../configureStore';

interface NavbarProps {
  user?: any;
  history?: any;
  [key: string]: any;
}

function Navbar({ user }: NavbarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const onLogoutBtnClick = () => {
    setAnchorEl(null);
    dispatch(signOut() as any);
    signOutFromSSOAndSiteMinder();
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <Link to={Routes.HOME}>
            <div className="navbar__logo">
              <img src={IMAGE_SRC.MYRANGEBC_LOGO_DARK} alt="Logo" />
            </div>
          </Link>
        </div>

        <div className="navbar__right">
          <NavLink
            to={Routes.HOME}
            className={({ isActive }: any) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
          >
            {SELECT_RUP}
            <div className="navbar__link__underline" />
          </NavLink>

          <>
            {canManageClients(user) && (
              <>
                <NavLink
                  to={Routes.MANAGE_CLIENT}
                  className={({ isActive }: any) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
                >
                  {MANAGE_CLIENTS}
                  <div className="navbar__link__underline" />
                </NavLink>
                <NavLink
                  to={Routes.MERGE_ACCOUNT}
                  className={({ isActive }: any) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
                >
                  {MERGE_ACCOUNT}
                  <div className="navbar__link__underline" />
                </NavLink>
              </>
            )}
            {canManageEmails(user) && (
              <NavLink
                to={Routes.EMAIL_TEMPLATE}
                className={({ isActive }: any) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
              >
                {EMAIL_TEMPLATE}
                <div className="navbar__link__underline" />
              </NavLink>
            )}
            {canAssignRoles(user) && (
              <>
                <NavLink
                  to={Routes.ASSIGN_ROLES_AND_DISTRICTS}
                  className={({ isActive }: any) => (isActive ? 'navbar__link navbar__link--active' : 'navbar__link')}
                >
                  {ASSIGN_ROLES_AND_DISTRICTS}
                  <div className="navbar__link__underline" />
                </NavLink>
              </>
            )}
          </>

          <div className="navbar__avatar">
            <span
              onClick={handleAvatarClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAvatarClick(e as any);
              }}
            >
              <Avatar user={user} />
              <MuiIcon name="angle down" style={{ marginRight: '-4px' }} />
            </span>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem id={ELEMENT_ID.SIGN_OUT} onClick={onLogoutBtnClick}>
                <ListItemIcon>
                  <MuiIcon name="sign-out" />
                </ListItemIcon>
                <ListItemText>Sign Out</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
