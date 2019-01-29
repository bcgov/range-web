import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class Footer extends Component {
  static propTypes = {
    withTopPad: PropTypes.bool,
  };

  static defaultProps = {
    withTopPad: false,
  };

  render() {
    const { withTopPad } = this.props;
    return (
      <Fragment>
        {withTopPad &&
          <section className="footer__pad" />
        }
        <footer className="footer">
          <div className="container">
            <div className="footer__content-list">
              <span>Home</span>
              <div className="footer__divider" />
              <span>About gov.bc.ca</span>
              <div className="footer__divider" />
              <span>Privacy</span>
              <div className="footer__divider" />
              <span>Accessibility</span>
              <div className="footer__divider" />
              <span>Disclaimer</span>
              <div className="footer__divider" />
              <span>Copyright</span>
              <div className="footer__divider" />
              <span>Contact Us</span>
            </div>
          </div>
        </footer>
      </Fragment>
    );
  }
}

export default Footer;
