import React from 'react';
import { Message, Icon } from 'semantic-ui-react';

interface ErrorMessageProps {
  message: string;
  warning?: boolean;
  [key: string]: any;
}

function ErrorMessage({ message, warning = false, ...rest }: ErrorMessageProps) {
  return (
    <Message
      warning={warning}
      error={!warning}
      {...rest}
      content={
        <>
          <Icon name="warning sign" style={{ marginRight: '7px' }} />
          {message}
        </>
      }
    />
  );
}

export default ErrorMessage;
