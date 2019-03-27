import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';

class ErrorMessage extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    warning: PropTypes.bool,
  }

  static defaultProps = {
    warning: false,
  }

  render() {
    const { message, warning, ...rest } = this.props;

    return (
      <Message
        warning={warning}
        error={!warning}
        {...rest}
        content={
          <Fragment>
            <Icon
              name="warning sign"
              style={{ marginRight: '7px' }}
            />
            {message}
          </Fragment>
        }
      />
    );
  }
}

export default ErrorMessage;
