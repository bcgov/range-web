import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Segment as _Segment, Form as _Form } from 'semantic-ui-react';

const Segment = _Segment as any;
const Form = _Form as any;
import { Loading, ErrorMessage, PrimaryButton } from '../common';
import { getUser, getIsUpdatingUser, getUpdatingUserErrorOccured } from '../../reducers/rootReducer';
import { allowAlphabetOnly, doesUserHaveFullName } from '../../utils';
import { updateUser } from '../../actionCreators';
import { UPDATE_USER_ERROR, APP_NAME } from '../../constants/strings';
import { RootState, AppDispatch } from '../../configureStore';

const UsernameInputModal: React.FC = () => {
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

  const onInputChanged = (e: any, { name, value }: any) => {
    if (name === 'givenName') setGivenName(value);
    if (name === 'familyName') setFamilyName(value);
  };

  const onUserTypeChange = (e: any, { value }: any) => {
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
    <Modal dimmer="blurring" style={{ width: '400px' }} open={missingLastAndFirstName}>
      <Segment>
        <Loading active={false} />
        <div className="un-input-modal">
          <div className="un-input-modal__header">Welcome to {APP_NAME}</div>
          <span className="un-input-modal__wave" role="img" aria-label="Wave">
            👋
          </span>
          <div className="un-input-modal__msg">Hey Stranger, What&#39;s your name?</div>
          <Form error={UpdatingUserErrorOccured}>
            <ErrorMessage message={UPDATE_USER_ERROR} style={{ marginBottom: '15px' }} />

            <Form.Group inline style={{ marginBottom: '15px' }} aria-label="User type selection">
              <div style={{ marginRight: '10px', fontWeight: 'bold' }}>I am a: </div>
              <Form.Radio
                label="Individual"
                name="userType"
                value="individual"
                checked={userType === 'individual'}
                onChange={onUserTypeChange}
              />
              <Form.Radio
                label="Company / Partnership"
                name="userType"
                value="company"
                checked={userType === 'company'}
                onChange={onUserTypeChange}
              />
            </Form.Group>

            {userType === 'individual' ? (
              <>
                <Form.Input
                  name="givenName"
                  label="First Name"
                  value={givenName}
                  error={isGivenEmpty}
                  onChange={onInputChanged}
                  onKeyPress={onInputPressed}
                />
                <Form.Input
                  name="familyName"
                  label="Last Name"
                  value={familyName}
                  error={isFamilyEmpty}
                  onChange={onInputChanged}
                  onKeyPress={onInputPressed}
                />
              </>
            ) : (
              <Form.Input
                name="givenName"
                label="Registered Company Name"
                value={givenName}
                error={isGivenEmpty}
                placeholder="Enter registered company name"
                onChange={onInputChanged}
              />
            )}

            <PrimaryButton fluid disabled={isSubmitDisabled} loading={isUpdatingUser} onClick={onSubmitClicked}>
              Submit
            </PrimaryButton>
          </Form>
        </div>
      </Segment>
    </Modal>
  );
};

export default UsernameInputModal;
