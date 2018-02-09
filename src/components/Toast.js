import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Message, Icon } from 'semantic-ui-react';

const propTypes = {
  close: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
}

class Toast extends Component {
  // getMessageLayout(success, message) {
  //   let layout = (
  //     <div className='message'> 
  //       <div className="icon"> <Icon name='ban' /> </div>
  //       {message} 
  //     </div>
  //   );

  //   if (success) {
  //     layout = (
  //       <div className='message'> 
  //         <div className="icon"> <Icon name='check circle' /> </div> 
  //         {message} 
  //       </div>
  //     );
  //   }

  //   return layout;
  // }

  render() {
    const { close, success, error, message } = this.props;

    return (
      <div className='toast-message-container'>
        {/* <Message 
          hidden={close}
          success={success}
          error={error}>

          {this.getMessageLayout(success, message)}  

        </Message>   */}
      </div>
    );
  }  
}

Toast.propTypes = propTypes;

const mapStateToProps = state => {
  const { close, success, error, message } = state.toastReducer;

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
