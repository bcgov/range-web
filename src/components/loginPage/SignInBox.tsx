import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import { Loading } from '../common';

import { LOCAL_STORAGE_KEY } from '../../constants/variables';
import { getDataFromLocalStorage } from '../../utils';
import { fetchUser, signOut } from '../../actionCreators';
import { storeAuthData, openPiaModal } from '../../actions';
import {
  getIsFetchingUser,
  getFetchingUserErrorResponse,
  getFetchingUserErrorOccured,
} from '../../reducers/rootReducer';
import SignInButtons from './SignInButtons';
import SignInErrorMessage from './SignInErrorMessage';
import { APP_NAME } from '../../constants/strings';
import { RootState, AppDispatch } from '../../configureStore';

function SignInBox() {
  const dispatch = useDispatch<AppDispatch>();
  const isFetchingUser = useSelector((state: RootState) => getIsFetchingUser(state));
  const errorFetchingUser = useSelector((state: RootState) => getFetchingUserErrorResponse(state));
  const errorOccuredFetchingUser = useSelector((state: RootState) => getFetchingUserErrorOccured(state));

  const storageEventListener = useCallback(
    (event: StorageEvent) => {
      if (JSON.parse(event.newValue || 'null')?.access_token) {
        const authData = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH);
        if (authData) {
          dispatch(storeAuthData(authData));
          (dispatch(fetchUser()) as any).then(({ piaSeen }: any) => {
            if (!piaSeen) {
              dispatch(openPiaModal());
            }
            window.location.reload();
          });
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    window.addEventListener('storage', storageEventListener);
    return () => {
      window.removeEventListener('storage', storageEventListener);
    };
  }, [storageEventListener]);

  const handleSignOut = () => {
    dispatch(signOut() as any);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, border: 'none', boxShadow: 'none', bgcolor: 'transparent' }}>
      <Loading active={isFetchingUser} />

      <div className="signin__container">
        <div className="signin__title">Sign In</div>
        <div className="signin__text1">to continue to {APP_NAME}</div>
        <div className="signin__text2">We use the BCeID for authentication.</div>
        <a
          className="signin__text3"
          href="https://portal.nrs.gov.bc.ca/web/client/bceid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about BCeID.
        </a>

        {errorOccuredFetchingUser && (
          <SignInErrorMessage errorFetchingUser={errorFetchingUser} signOut={handleSignOut} />
        )}

        {!errorOccuredFetchingUser && <SignInButtons />}
      </div>
    </Paper>
  );
}

export default SignInBox;
