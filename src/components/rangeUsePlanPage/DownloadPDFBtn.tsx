import React, { Fragment } from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import { DOWNLOAD_PDF } from '../../constants/strings';

interface DownloadPDFBtnProps {
  onClick?: () => void;
  disabled?: boolean;
}

const DownloadPDFBtn = ({ onClick, disabled = false }: DownloadPDFBtnProps) => (
  <Fragment>
    <Menu.Item disabled={disabled} onClick={onClick}>
      <Icon name="file pdf outline" />
      {DOWNLOAD_PDF}
    </Menu.Item>
  </Fragment>
);

export default DownloadPDFBtn;
