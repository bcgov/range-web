import React from 'react';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return <span className="sui-error-message">{message}</span>;
}

export default ErrorMessage;
