import React from 'react';
import Alert from '@mui/material/Alert';
import MuiIcon from './MuiIcon';

interface ErrorMessageProps {
  message: string;
  warning?: boolean;
  [key: string]: any;
}

function ErrorMessage({ message, warning = false, ...rest }: ErrorMessageProps) {
  return (
    <Alert severity={warning ? 'warning' : 'error'} icon={<MuiIcon name="warning sign" />} {...rest}>
      {message}
    </Alert>
  );
}

export default ErrorMessage;
