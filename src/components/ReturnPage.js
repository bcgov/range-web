import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parseQuery, getTokenFromSSO, saveAuthDataInLocal } from '../utils';
import { SSO_LOGOUT_ENDPOINT } from '../constants/api';
import { REDIRECTING } from '../constants/strings';

class ReturnPage extends Component {
  static propTypes = {
    location: PropTypes.shape({ search: PropTypes.string }),
  };

  static defaultProps = {
    location: {},
  }

  componentDidMount() {
    const { location } = this.props;
    // grab the code from the redirect url
    const { type, code } = parseQuery(location.search);

    switch (type) {
      case 'login':
        getTokenFromSSO(code).then((response) => {
          saveAuthDataInLocal(response);
          window.close();
        });
        break;
      case 'smlogout':
        // just returned from SiteMinder, sign out from SSO this time
        window.open(SSO_LOGOUT_ENDPOINT, '_self');
        break;
      case 'logout':
        // done signing out close this tab
        window.close();
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <section>{REDIRECTING}</section>
    );
  }
}

export default ReturnPage;
