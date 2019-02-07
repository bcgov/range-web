import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';

class ErrorMessage extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    style: PropTypes.shape({}),
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const { message, style } = this.props;

    return (
      <Message error style={style}>
        <Message.Content>
          <Icon
            name="warning sign"
            style={{ marginRight: '7px' }}
          />
          {message}
        </Message.Content>
      </Message>
    );
  }
}

export default ErrorMessage;
