import React from 'react';
import { Icon } from 'semantic-ui-react';
import { PrimaryButton } from './index';

interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  return (
    <div className="error-page">
      <Icon name="warning circle" size="big" color="red" />
      <div>
        <span className="error-page__message">{message}</span>
      </div>
      <div>
        <PrimaryButton onClick={() => window.location.reload()} content="Reload" />
      </div>
    </div>
  );
};

export default ErrorPage;
