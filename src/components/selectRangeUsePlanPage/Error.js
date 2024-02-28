import React from 'react';
import { PrimaryButton } from '../common';
import * as strings from '../../constants/strings';

const Error = ({ onRetry }) => (
  <div className="agrm__table__row">
    <div className="agrm__message agrm__message--error">
      {strings.ERROR_OCCUR}
      <PrimaryButton inverted onClick={onRetry} style={{ marginLeft: '10px' }}>
        Retry
      </PrimaryButton>
    </div>
  </div>
);

export default Error;
