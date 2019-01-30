import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'semantic-ui-react';
import SignInBox from '../auth/SignInBox';
import { signOut } from '../../actionCreators';
import { getReAuthRequired } from '../../reducers/rootReducer';
import { signOutFromSSO } from '../../utils';

class SignInModal extends Component {
  static propTypes = {
    reAuthRequired: PropTypes.bool.isRequired,
    signOut: PropTypes.func.isRequired,
  }

  onLoginPageBtnClicked = () => {
    this.props.signOut();
    signOutFromSSO();
  }

  render() {
    const { reAuthRequired } = this.props;

    return (
      <Modal
        dimmer="blurring"
        style={{ width: '400px' }}
        open={reAuthRequired}
      >
        <div className="signin-modal__msg">
          Your session has expired, please sign in again.
        </div>

        <SignInBox />

        <div className="signin-modal__login-msg">
          <div>
            Return to &nbsp;
            <span
              className="signin-modal__login-btn"
              role="button"
              tabIndex="0"
              onClick={this.onLoginPageBtnClicked}
            >
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
  }
}

const mapStateToProps = state => (
  {
    reAuthRequired: getReAuthRequired(state),
  }
);
export default connect(mapStateToProps, { signOut })(SignInModal);
