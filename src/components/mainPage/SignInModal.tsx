import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import MuiIcon from '../common/MuiIcon';
import { signOut } from '../../actionCreators';
import { getReAuthRequired } from '../../reducers/rootReducer';
import { signOutFromSSOAndSiteMinder } from '../../utils';
import SignInBox from '../loginPage/SignInBox';
import { RootState, AppDispatch } from '../../configureStore';

function SignInModal() {
  const dispatch = useDispatch<AppDispatch>();
  const reAuthRequired = useSelector((state: RootState) => getReAuthRequired(state));

  const onLoginPageBtnClicked = () => {
    dispatch(signOut() as any);
    signOutFromSSOAndSiteMinder();
  };

  return (
    <Dialog open={reAuthRequired} maxWidth="xs">
      <DialogContent>
        <div className="signin-modal__msg">Your session has expired, please sign in again.</div>

        <SignInBox />

        <div className="signin-modal__login-msg">
          <div>
            Return to &nbsp;
            <span className="signin-modal__login-btn" role="button" tabIndex={0} onClick={onLoginPageBtnClicked}>
              Landing Page
            </span>
            <div className="signin-modal__warning-msg">
              <MuiIcon name="warning sign" />
              Unsaved work will be lost
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignInModal;
