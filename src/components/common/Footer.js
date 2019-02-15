import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import PrivacyInfoModal from './PrivacyInfoModal';

class Footer extends Component {
  static propTypes = {
    withTopPad: PropTypes.bool,
  };

  static defaultProps = {
    withTopPad: false,
  };

  state = {
    isPrivacyInfoModalOpen: false,
  }

  openPrivacyInfoModal = () => this.setState({ isPrivacyInfoModalOpen: true })
  closePrivacyInfoModal = () => this.setState({ isPrivacyInfoModalOpen: false })

  render() {
    const { withTopPad } = this.props;
    const { isPrivacyInfoModalOpen } = this.state;

    return (
      <Fragment>
        <PrivacyInfoModal
          open={isPrivacyInfoModalOpen}
          closeModal={this.closePrivacyInfoModal}
        />

        {withTopPad &&
          <section className="footer__pad" />
        }

        <footer className="footer">
          <div className="container">
            <div className="footer__content-list">
              <a href="https://www2.gov.bc.ca/gov/content/home" target="_blank" rel="noopener noreferrer">
                Home
              </a>
              <div className="footer__divider" />
              <a href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca" target="_blank" rel="noopener noreferrer">
                About gov.bc.ca
              </a>
              <div className="footer__divider" />
              <a href="https://www2.gov.bc.ca/gov/content/home/disclaimer" target="_blank" rel="noopener noreferrer">
                Disclaimer
              </a>
              <div className="footer__divider" />
              <button className="footer__privacy-btn" onClick={this.openPrivacyInfoModal}>
                Privacy
              </button>
              <div className="footer__divider" />
              <a href="https://www2.gov.bc.ca/gov/content/home/accessibility" target="_blank" rel="noopener noreferrer">
                Accessibility
              </a>
              <div className="footer__divider" />
              <a href="https://www2.gov.bc.ca/gov/content/home/copyright" target="_blank" rel="noopener noreferrer">
                Copyright
              </a>
              <div className="footer__divider" />
              <a href="https://www2.gov.bc.ca/StaticWebResources/static/gov3/html/contact-us.html" target="_blank" rel="noopener noreferrer">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </Fragment>
    );
  }
}

export default Footer;
