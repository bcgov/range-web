import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import moment from 'moment';
import { SESSION_EXPIRY_WARNING_DURATION } from '../../../constants/variables';

const SessionExpiryWarning = ({ onExtend }) => {
  const [seconds, setSeconds] = useState(SESSION_EXPIRY_WARNING_DURATION);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleExtendClick = () => {
    onExtend();
  };

  const formattedTime = moment.utc(seconds * 1000).format('mm:ss');

  return (
    <div className="toast__content">
      <div>Your session will expire in {formattedTime}</div>
      <div>Save your changes periodically</div>
      <Button onClick={handleExtendClick} size="small" style={{ marginLeft: '10px' }}>
        Extend Session
      </Button>
    </div>
  );
};

SessionExpiryWarning.propTypes = {
  onExtend: PropTypes.func.isRequired,
};

export default SessionExpiryWarning;
