import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';

const propTypes = {
  close: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

const Toast = ({
  close,
  success,
  error,
  message,
}) => (
  <div className="toast">
    <Message
      icon
      hidden={close && !message}
      success={success}
      error={error}
    >
      <div className="toast__message">
        <div className="toast__message__icon">
          <Icon size="large" name={success ? 'check circle' : 'ban'} />
        </div>
        <div className="toast__message__content">
          {message}
        </div>
      </div>
    </Message>
  </div>
);

const mapStateToProps = state => (
  { ...state.toast }
);

Toast.propTypes = propTypes;
export default connect(mapStateToProps, null)(Toast);
