import React from 'react';
import { PrimaryButton } from '../common';
import * as strings from '../../constants/strings';

interface ErrorProps {
  onRetry: () => void;
}

function Error({ onRetry }: ErrorProps) {
  return (
    <div className="agrm__table__row">
      <div className="agrm__message agrm__message--error">
        {strings.ERROR_OCCUR}
        <PrimaryButton inverted onClick={onRetry} style={{ marginLeft: '10px' }}>
          Retry
        </PrimaryButton>
      </div>
    </div>
  );
}

export default Error;
