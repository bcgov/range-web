import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Icon } from 'semantic-ui-react';
import { signOut } from '../../actionCreators';
import { getReAuthRequired } from '../../reducers/rootReducer';
import { signOutFromSSOAndSiteMinder } from '../../utils';
import SignInBox from '../loginPage/SignInBox';
import { RootState, AppDispatch } from '../../configureStore';

const SignInModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reAuthRequired = useSelector((state: RootState) => getReAuthRequired(state));

  const onLoginPageBtnClicked = () => {
    dispatch(signOut() as any);
    signOutFromSSOAndSiteMinder();
  };

  return (
    <Modal dimmer="blurring" style={{ width: '400px' }} open={reAuthRequired}>
      <div className="signin-modal__msg">Your session has expired, please sign in again.</div>

      <SignInBox />

      <div className="signin-modal__login-msg">
        <div>
          Return to &nbsp;
          <span className="signin-modal__login-btn" role="button" tabIndex={0} onClick={onLoginPageBtnClicked}>
            Landing Page
          </span>
          <div className="signin-modal__warning-msg">
            <Icon name="warning sign" />
            Unsaved work will be lost
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignInModal;
