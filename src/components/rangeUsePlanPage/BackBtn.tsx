import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HOME } from '../../constants/routes';

interface BackBtnProps {
  className?: string;
  agreementId?: string;
}

const BackBtn = ({ className = '', agreementId }: BackBtnProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { page = 0, prevSearch } = (location.state as any) || {};

  const search = prevSearch ?? `?selected=${agreementId}`;

  return (
    <div
      className={className}
      onClick={() => navigate(`${HOME}/${page === 0 ? '' : page + 1}${search}`)}
      role="button"
      tabIndex={0}
    >
      <Icon name="arrow circle left" size="large" />
    </div>
  );
};

export default BackBtn;
