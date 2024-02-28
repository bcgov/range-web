import React, { Fragment } from 'react';
import { Icon, Menu } from 'semantic-ui-react';
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
    <Menu.Item disabled={disabled} onClick={onClick}>
      <Icon name="file pdf outline" />
      {DOWNLOAD_PDF}
    </Menu.Item>
  </Fragment>
);

DownloadPDFBtn.propTypes = propTypes;
DownloadPDFBtn.defaultProps = defaultProps;
export default DownloadPDFBtn;
