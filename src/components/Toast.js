import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';

const propTypes = {
  close: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
}

class Toast extends Component {
  render() {
    const { close, success, error, message } = this.props;

    return (
      <div className='toast'>
        <Message
          icon
          hidden={close && !message}
          success={success}
          error={error}>

          <div className="toast__message"> 
            <div className="toast__message__icon">
              <Icon size="large" name={success ? "check circle" : "ban"} /> 
            </div>
            <div className="toast__message__content">
              {message} 
            </div>
          </div>

        </Message>  
      </div>
    );
  }  
}

Toast.propTypes = propTypes;

const mapStateToProps = state => {
  const { close, success, error, message } = state.toast;

  return {
    close,
    success,
    error,
    message,
  }; 
};

export default connect (
  mapStateToProps, null
)(Toast)
