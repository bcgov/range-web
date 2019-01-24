import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import { fetchUser, signOut } from '../../actionCreators';
import { storeAuthData } from '../../actions';
import { getIsFetchingUser, getUserErrorResponse, getUserErrorOccured, getReAuthRequired } from '../../reducers/rootReducer';
import SignInBox from '../auth/SignInBox';

class SignInModal extends Component {
  render() {
    const { reAuthRequired } = this.props;

    return (
      <Modal
        dimmer="blurring"
        style={{ width: '400px' }}
        open={reAuthRequired}
      >
        <div className="signin-modal__message">
          Your session has expired, please sign in again.
        </div>
        <SignInBox {...this.props} />
        {/* <div>
          Return to Login
        </div> */}
      </Modal>
    );
  }
}

const mapStateToProps = state => (
  {
    isFetchingUser: getIsFetchingUser(state),
    errorFetchingUser: getUserErrorResponse(state),
    errorOccuredFetchingUser: getUserErrorOccured(state),
    reAuthRequired: getReAuthRequired(state),
  }
);
export default connect(mapStateToProps, { fetchUser, storeAuthData, signOut })(SignInModal);
