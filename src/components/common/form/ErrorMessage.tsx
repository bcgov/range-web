import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <span className="sui-error-message">{message}</span>
);

export default ErrorMessage;
