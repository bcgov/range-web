import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parseQuery, getTokenFromSSO, saveAuthDataInLocal } from '../utils';
import { SSO_LOGOUT_ENDPOINT } from '../constants/API';

const propTypes = {
  location: PropTypes.shape({}),
};
const defaultProps = {
  location: {},
};

class ReturnPage extends Component {
  componentDidMount() {
    const { location } = this.props;
    // grab the code from the redirect url
    const { type, code } = parseQuery(location.search);
    if (type === 'login' && code) {
      const tokenReceived = (response) => {
        saveAuthDataInLocal(response);
        window.close();
      };
      getTokenFromSSO(code).then(tokenReceived);
    } else if (type === 'smlogout') {
      // just returned from SiteMinder, sign out from SSO this time
      window.open(SSO_LOGOUT_ENDPOINT, '_self');
    } else if (type === 'logout') {
      // done signing out close this tab
      window.close();
    }
  }

  render() {
    return (
      <div>Return Page</div>
    );
  }
}
ReturnPage.propTypes = propTypes;
ReturnPage.defaultProps = defaultProps;
export default ReturnPage;
