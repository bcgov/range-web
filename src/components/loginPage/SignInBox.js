import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Segment } from 'semantic-ui-react'
import { Loading } from '../common'
import { LOCAL_STORAGE_KEY } from '../../constants/variables'
import { getDataFromLocalStorage } from '../../utils'
import { fetchUser, signOut, resetTimeoutForReAuth } from '../../actionCreators'
import { storeAuthData, reauthenticate, openPiaModal } from '../../actions'
import {
  getIsFetchingUser,
  getFetchingUserErrorResponse,
  getFetchingUserErrorOccured
} from '../../reducers/rootReducer'
import SignInButtons from './SignInButtons'
import SignInErrorMessage from './SignInErrorMessage'
import { APP_NAME } from '../../constants/strings'

export class SignInBox extends Component {
  static propTypes = {
    isFetchingUser: PropTypes.bool.isRequired,
    errorOccuredFetchingUser: PropTypes.bool.isRequired,
    errorFetchingUser: PropTypes.shape({}),
    signOut: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    storeAuthData: PropTypes.func.isRequired,
    resetTimeoutForReAuth: PropTypes.func.isRequired,
    reauthenticate: PropTypes.func.isRequired,
    openPiaModal: PropTypes.func.isRequired
  }

  static defaultProps = {
    errorFetchingUser: null
  }

  componentDidMount() {
    // Sets up localstorage listener for cross-tab communication
    // since the authentication requires the user to be redirected to a new tab
    // and then redirected back to a return URL(land in ReturnPage.js) with the token.
    window.addEventListener('storage', this.storageEventListener)
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageEventListener)
  }

  storageEventListener = () => {
    const {
      storeAuthData,
      fetchUser,
      resetTimeoutForReAuth,
      reauthenticate,
      openPiaModal
    } = this.props
    const authData = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH)

    if (authData) {
      storeAuthData(authData) // store the auth data in Redux store
      resetTimeoutForReAuth(reauthenticate)
      fetchUser().then(({ piaSeen }) => {
        if (!piaSeen) {
          openPiaModal()
        }
      })
    }
  }

  render() {
    const {
      isFetchingUser,
      errorOccuredFetchingUser,
      errorFetchingUser,
      signOut
    } = this.props

    return (
      <Segment basic>
        <Loading active={isFetchingUser} />

        <div className="signin__container">
          <div className="signin__title">Sign In</div>
          <div className="signin__text1">to continue to {APP_NAME}</div>
          <div className="signin__text2">
            We use the BCeID for authentication.
          </div>
          <a
            className="signin__text3"
            href="https://portal.nrs.gov.bc.ca/web/client/bceid"
            target="_blank"
            rel="noopener noreferrer">
            Learn more about BCeID.
          </a>

          {errorOccuredFetchingUser && (
            <SignInErrorMessage
              errorFetchingUser={errorFetchingUser}
              signOut={signOut}
            />
          )}

          {!errorOccuredFetchingUser && <SignInButtons />}
        </div>
      </Segment>
    )
  }
}

const mapStateToProps = state => ({
  isFetchingUser: getIsFetchingUser(state),
  errorFetchingUser: getFetchingUserErrorResponse(state),
  errorOccuredFetchingUser: getFetchingUserErrorOccured(state)
})

export default connect(
  mapStateToProps,
  {
    fetchUser,
    storeAuthData,
    signOut,
    reauthenticate,
    resetTimeoutForReAuth,
    openPiaModal
  }
)(SignInBox)
