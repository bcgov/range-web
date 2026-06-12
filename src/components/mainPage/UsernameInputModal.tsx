import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Loading, ErrorMessage, PrimaryButton } from '../common';
import { getUser, getIsUpdatingUser, getUpdatingUserErrorOccured } from '../../reducers/rootReducer';
import { allowAlphabetOnly, doesUserHaveFullName } from '../../utils';
import { updateUser } from '../../actionCreators';
import { UPDATE_USER_ERROR, APP_NAME } from '../../constants/strings';
import { RootState, AppDispatch } from '../../configureStore';

function UsernameInputModal() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => getUser(state));
  const isUpdatingUser = useSelector((state: RootState) => getIsUpdatingUser(state));
  const UpdatingUserErrorOccured = useSelector((state: RootState) => getUpdatingUserErrorOccured(state));

  const [familyName, setFamilyName] = useState((user as any)?.familyName || '');
  const [givenName, setGivenName] = useState((user as any)?.givenName || '');
  const [userType, setUserType] = useState(
    (user as any)?.givenName && !(user as any)?.familyName ? 'company' : 'individual',
  );

  const onSubmitClicked = (e: any) => {
    e.preventDefault();

    if (userType === 'company') {
      dispatch(updateUser({ givenName, familyName: '' }) as any);
    } else {
      dispatch(updateUser({ givenName, familyName }) as any);
    }
  };

  const onInputPressed = (e: any) => {
    allowAlphabetOnly(e);
  };

  const onTextInputChanged = (e: any) => {
    const { name, value } = e.target;
    if (name === 'givenName') setGivenName(value);
    if (name === 'familyName') setFamilyName(value);
  };

  const onUserTypeChange = (e: any, value: string) => {
    setUserType(value);
    setGivenName('');
    setFamilyName('');
  };

  const isGivenEmpty = givenName === '';
  const isFamilyEmpty = familyName === '';
  const missingLastAndFirstName = !doesUserHaveFullName(user);

  const isSubmitDisabled =
    (userType === 'individual' && (isGivenEmpty || isFamilyEmpty)) || (userType === 'company' && isGivenEmpty);

  return (
    <Dialog maxWidth="xs" open={missingLastAndFirstName}>
      <DialogContent>
        <Loading active={false} />
        <div className="un-input-modal">
          <div className="un-input-modal__header">Welcome to {APP_NAME}</div>
          <span className="un-input-modal__wave" role="img" aria-label="Wave">
            👋
          </span>
          <div className="un-input-modal__msg">Hey Stranger, What&#39;s your name?</div>

          <form onSubmit={onSubmitClicked}>
            {UpdatingUserErrorOccured && <ErrorMessage message={UPDATE_USER_ERROR} style={{ marginBottom: '15px' }} />}

            <FormControl component="fieldset" style={{ marginBottom: '15px', width: '100%' }}>
              <FormLabel component="legend">I am a:</FormLabel>
              <RadioGroup
                row
                aria-label="User type selection"
                name="userType"
                value={userType}
                onChange={(e, value) => onUserTypeChange(e, value)}
              >
                <FormControlLabel value="individual" control={<Radio />} label="Individual" />
                <FormControlLabel value="company" control={<Radio />} label="Company / Partnership" />
              </RadioGroup>
            </FormControl>

            {userType === 'individual' ? (
              <>
                <TextField
                  name="givenName"
                  label="First Name"
                  value={givenName}
                  error={isGivenEmpty}
                  onChange={onTextInputChanged}
                  onKeyPress={onInputPressed}
                  fullWidth
                  variant="outlined"
                  size="small"
                  style={{ marginBottom: 16 }}
                />
                <TextField
                  name="familyName"
                  label="Last Name"
                  value={familyName}
                  error={isFamilyEmpty}
                  onChange={onTextInputChanged}
                  onKeyPress={onInputPressed}
                  fullWidth
                  variant="outlined"
                  size="small"
                  style={{ marginBottom: 16 }}
                />
              </>
            ) : (
              <TextField
                name="givenName"
                label="Registered Company Name"
                value={givenName}
                error={isGivenEmpty}
                placeholder="Enter registered company name"
                onChange={onTextInputChanged}
                fullWidth
                variant="outlined"
                size="small"
                style={{ marginBottom: 16 }}
              />
            )}

            <PrimaryButton fluid disabled={isSubmitDisabled} loading={isUpdatingUser} type="submit">
              Submit
            </PrimaryButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UsernameInputModal;
