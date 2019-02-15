import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
// import { getInputModal } from '../../reducers/rootReducer';
// import { openInputModal, closeInputModal } from '../../actions';
import { PrimaryButton } from './index';
import { APP_NAME } from '../../constants/strings';

class PrivacyInfoModal extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    trigger: PropTypes.node,
    // inputModal: PropTypes.shape({
    //   title: PropTypes.string,
    //   input: PropTypes.string,
    //   value: PropTypes.shape({}),
    //   onSubmit: PropTypes.func,
    // }),
  }

  static defaultProps = {
    trigger: null,
  }

  render() {
    const { trigger, closeModal } = this.props;

    return (
      <Modal
        dimmer="blurring"
        closeIcon
        trigger={trigger}
        open
        size="small"
      >
        <Modal.Content>
          <div className="privacy-info">
            <div className="privacy-info__title">
              Privacy Information
            </div>
            <div className="privacy-info__sub-title">
              Please review to return to {APP_NAME}
            </div>
            <div>
              <div>
                Personal information is collected under the legal authority of section 26 (c) and 27 (1)(a)(i) of the Freedom of Information and Protection of Privacy Act (the Act). The collection, use, and disclosure of personal information is subject to the provisions of the Act. The personal information collected will be used to process your submission(s). It may also be shared when strictly necessary with partner agencies that are also subject to the provisions of the Act. The personal information supplied in the submission may be used for referrals, consultation, or notifications as required. Staff may use your personal information to contact you regarding your submission or for survey purposes.
              </div>
              <div className="privacy-info__space" />
              <div>
                For more information regarding the collection, use, and/or disclosure of your personal information, please contact MyRangeBC Administrator at:
              </div>
              <div className="privacy-info__space" />
              <div>
                Email: myrangebc@gov.bc.ca
              </div>
              <div className="privacy-info__space" />
              <div>Telephone: 250 371-3827</div>
              <div className="privacy-info__space" />
              <div>Mailing Address:</div>
              <div><b>Ministry of Forests, Lands, Natural Resource Operations and Rural Development</b></div>
              <div>Range Branch - Kamloops</div>
              <div>Attn: MyRangeBC</div>
              <div>441 Columbia Street</div>
              <div>Kamloops, BC</div>
              <div>V2C 2T3</div>
            </div>
            <a
              href="https://www2.gov.bc.ca/gov/content/home/divrivacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', marginTop: '10px' }}
            >
              Open B.C. Government Website Privacy
            </a>
          </div>
          <div className="privacy-info__continue-btn">
            <PrimaryButton
              content={`Continue to ${APP_NAME}`}
              onClick={closeModal}
            />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default PrivacyInfoModal;

// const mapStateToProps = state => ({
//   inputModal: getInputModal(state),
// });
// export default connect(mapStateToProps, {
//   openInputModal,
//   closeInputModal,
// })(InputModal);
