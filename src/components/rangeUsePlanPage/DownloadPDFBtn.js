import React, { Fragment } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DOWNLOAD_PDF } from '../../constants/strings';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const defaultProps = {
  disabled: false,
};

const DownloadPDFBtn = ({ onClick, disabled }) => (
  <Fragment>
    <Button
      className="rup__download-pdf-btn--short"
      compact
      inverted
      disabled={disabled}
      onClick={onClick}
      icon="file pdf outline"
      style={{ marginRight: '0' }}
    />
    <Button
      className="rup__download-pdf-btn--long"
      compact
      inverted
      disabled={disabled}
      onClick={onClick}
      style={{ marginRight: '0' }}
    >
      <Icon name="file pdf outline" />
      {DOWNLOAD_PDF}
    </Button>
  </Fragment>
);

DownloadPDFBtn.propTypes = propTypes;
DownloadPDFBtn.defaultProps = defaultProps;
export default DownloadPDFBtn;
