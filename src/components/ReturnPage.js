import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  parseQuery,
  getTokenFromSSO,
  saveAuthDataInLocal,
  getDataFromLocalStorage,
} from '../utils';
import { SSO_LOGOUT_ENDPOINT } from '../constants/api';
import { REDIRECTING } from '../constants/strings';
import { LOCAL_STORAGE_KEY, RETURN_PAGE_TYPE } from '../constants/variables';

class ReturnPage extends Component {
  static propTypes = {
    location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  };

  componentDidMount() {
    const { location } = this.props;
    // grab the code from the redirect url
    const { type, code } = parseQuery(location.search);

    switch (type) {
      case RETURN_PAGE_TYPE.LOGIN:
        if (code) {
          const { codeVerifier, codeVerifierHash } = getDataFromLocalStorage(
            LOCAL_STORAGE_KEY.AUTH_PKCE_CODE,
          );
          if (!codeVerifier || !codeVerifierHash) {
            // we cannot proceed without the pkce challenge code
            window.close();
          } else {
            getTokenFromSSO(code).then((response) => {
              saveAuthDataInLocal(response);
              window.close();
            });
          }
        }
        break;
      case RETURN_PAGE_TYPE.SITEMINDER_LOGOUT:
        // just returned from SiteMinder, sign out from SSO this time
        window.open(SSO_LOGOUT_ENDPOINT, '_self');
        break;
      case RETURN_PAGE_TYPE.LOGOUT:
        // finished logging out, close this page
        window.location = '/';
        break;
      default:
        break;
    }
  }

  render() {
    return <section>{REDIRECTING}</section>;
  }
}

export default ReturnPage;
