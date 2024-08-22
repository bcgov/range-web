import React from 'react';
import { APP_NAME } from '../../constants/strings';

const BrowserWarningHeader = () => (
  <article className="login__no-support-browser">
    <div className="login__no-support-browser__title">Your internet browser is not supported.</div>
    <div>
      <div>
        Please visit {APP_NAME} using a supported browser:
        <a href="https://www.google.com/chrome" target="_blank" rel="noopener noreferrer">
          {' '}
          Google Chrome,
        </a>
        <a href="https://www.mozilla.org/en-US/firefox/new" target="_blank" rel="noopener noreferrer">
          {' '}
          Firefox,
        </a>
        <a href="https://www.microsoft.com/en-ca/windows/microsoft-edge" target="_blank" rel="noopener noreferrer">
          {' '}
          Microsoft Edge,
        </a>
        <a href="https://support.apple.com/en-ca/safari" target="_blank" rel="noopener noreferrer">
          {' '}
          Safari{' '}
        </a>
        (Mac only).
      </div>
      If you choose to continue with this browser the application may not work as intended.
    </div>
  </article>
);

export default BrowserWarningHeader;
