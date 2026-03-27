import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Segment, Form } from 'semantic-ui-react';
import { Loading, ErrorMessage, PrimaryButton } from '../common';
import { getUser, getIsUpdatingUser, getUpdatingUserErrorOccured } from '../../reducers/rootReducer';
import { allowAlphabetOnly, doesUserHaveFullName } from '../../utils';
import { updateUser } from '../../actionCreators';
import { UPDATE_USER_ERROR, APP_NAME } from '../../constants/strings';

class UsernameInputModal extends Component {
  static propTypes = {
    user: PropTypes.shape({
      givenName: PropTypes.string,
      familyName: PropTypes.string,
    }).isRequired,
    updateUser: PropTypes.func.isRequired,
    isUpdatingUser: PropTypes.bool.isRequired,
    UpdatingUserErrorOccured: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    const { givenName, familyName } = this.props.user;
    this.state = {
      familyName: familyName || '',
      givenName: givenName || '',
      userType: givenName && !familyName ? 'company' : 'individual',
    };
  }

  onSubmitClicked = (e) => {
    e.preventDefault();
    const { familyName, givenName, userType } = this.state;

    if (userType === 'company') {
      this.props.updateUser({
        givenName,
        familyName: '',
      });
    } else {
      this.props.updateUser({
        givenName,
        familyName,
      });
    }
  };

  onInputPressed = (e) => {
    allowAlphabetOnly(e);
  };

  onInputChanged = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  };

  onUserTypeChange = (e, { value }) => {
    this.setState({
      userType: value,
      givenName: '',
      familyName: '',
    });
  };

  render() {
    const { user, isUpdatingUser, UpdatingUserErrorOccured } = this.props;
    const { familyName, givenName, userType } = this.state;
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
                  onChange={this.onUserTypeChange}
                />
                <Form.Radio
                  label="Company / Partnership"
                  name="userType"
                  value="company"
                  checked={userType === 'company'}
                  onChange={this.onUserTypeChange}
                />
              </Form.Group>

              {userType === 'individual' ? (
                <>
                  <Form.Input
                    name="givenName"
                    label="First Name"
                    value={givenName}
                    error={isGivenEmpty}
                    onChange={this.onInputChanged}
                    onKeyPress={this.onInputPressed}
                  />
                  <Form.Input
                    name="familyName"
                    label="Last Name"
                    value={familyName}
                    error={isFamilyEmpty}
                    onChange={this.onInputChanged}
                    onKeyPress={this.onInputPressed}
                  />
                </>
              ) : (
                <Form.Input
                  name="givenName"
                  label="Registered Company Name"
                  value={givenName}
                  error={isGivenEmpty}
                  placeholder="Enter registered company name"
                  onChange={this.onInputChanged}
                />
              )}

              <PrimaryButton fluid disabled={isSubmitDisabled} loading={isUpdatingUser} onClick={this.onSubmitClicked}>
                Submit
              </PrimaryButton>
            </Form>
          </div>
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  user: getUser(state),
  isUpdatingUser: getIsUpdatingUser(state),
  UpdatingUserErrorOccured: getUpdatingUserErrorOccured(state),
});

export default connect(mapStateToProps, {
  updateUser,
})(UsernameInputModal);
