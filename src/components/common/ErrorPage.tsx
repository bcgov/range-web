import React from 'react';
import MuiIcon from './MuiIcon';
import { PrimaryButton } from './index';

interface ErrorPageProps {
  message: string;
}

function ErrorPage({ message }: ErrorPageProps) {
  return (
    <div className="error-page">
      <MuiIcon name="warning circle" size="big" color="red" />
      <div>
        <span className="error-page__message">{message}</span>
      </div>
      <div>
        <PrimaryButton onClick={() => window.location.reload()} content="Reload" />
      </div>
    </div>
  );
}

export default ErrorPage;
