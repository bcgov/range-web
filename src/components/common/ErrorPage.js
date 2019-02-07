import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'semantic-ui-react';

const propTypes = {
  message: PropTypes.string.isRequired,
};

const ErrorPage = ({ message }) => {
  return (
    <div className="error-page">
      <Icon name="warning circle" size="big" color="red" />
      <div>
        <span className="error-page__message">
          {message}
        </span>
      </div>
      <div>
        <Button onClick={() => window.location.reload(true)}>Reload</Button>
      </div>
    </div>
  );
};

ErrorPage.propTypes = propTypes;
export default ErrorPage;
