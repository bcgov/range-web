import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { COW_PIC_SRC } from '../../constants/variables';
import { parseQuery } from '../../handlers';
import { SSO_LOGOUT_ENDPOINT } from '../../constants/api';

const propTypes = {
  location: PropTypes.shape({ search: PropTypes.object }).isRequired,
};

export class Logout extends Component {
  componentDidMount() {
    const { smret } = parseQuery(this.props.location.search);
    if (smret) {
      // just returned from SiteMinder, sign out from SSO this time
      window.open(SSO_LOGOUT_ENDPOINT, '_self');
    } else {
      // done signing out close this tab in 10 seconds
      this.timer = setTimeout(() => {
        window.close();
      }, 10000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <div className="logout">
        <div className="logout__container">
          <img
            className="logout__image"
            src={COW_PIC_SRC}
            alt="cow-img"
          />
          <div className="logout__title">Good bye!</div>
          <div className="logout__content">
            <p>You are successfully signed out!</p>
            {/* <p>You will be redirected to the My Range Application home page within 10 seconds.</p> */}
            <p>This page will be closed in 10 seconds.</p>
          </div>
        </div>
      </div>
    );
  }
}

Logout.propTypes = propTypes;
export default Logout;
