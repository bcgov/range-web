import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Message, Icon } from 'semantic-ui-react';
import { signOutFromSSO } from '../../utils';
import { SIGN_IN_ERROR } from '../../constants/strings';

class SignInErrorMessage extends Component {
  static propTypes = {
    errorFetchingUser: PropTypes.shape({}),
    signOut: PropTypes.func.isRequired,
  }

  static defaultProps = {
    errorFetchingUser: null,
  }

  onLogoutBtnClick = () => {
    this.props.signOut();
    signOutFromSSO();
  }

  render() {
    const { errorFetchingUser: errResponse } = this.props;

    let message = SIGN_IN_ERROR;

    if (errResponse) {
      const { data, status } = errResponse;
      if (data && status) {
        const { error: errorMessage } = data;
        if (status === 403 && errorMessage && typeof errorMessage === 'string') {
          // read a specific error message from the server
          // it will be either the account being not active or not having a role
          message = errorMessage;
        }
      }
    }

    return (
      <div className="signin__error">
        <Message error>
          <Message.Content>
            <Icon
              name="warning sign"
              style={{ marginRight: '5px' }}
            />
            {message}
          </Message.Content>
        </Message>
        <Button
          primary
          fluid
          style={{ height: '50px', marginTop: '15px' }}
          onClick={this.onLogoutBtnClick}
        >
          Sign Out
        </Button>
      </div>
    );
  }
}

export default SignInErrorMessage;
