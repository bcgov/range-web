import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HOME } from '../../constants/routes';

const BackBtn = ({ className = '', agreementId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { page = 0, prevSearch } = location.state || {};

  const search = prevSearch ?? `?selected=${agreementId}`;

  return (
    <div
      className={className}
      onClick={() => navigate(`${HOME}/${page === 0 ? '' : page + 1}${search}`)}
      role="button"
      tabIndex="0"
    >
      <Icon name="arrow circle left" size="large" />
    </div>
  );
};

BackBtn.propTypes = {
  agreementSearchParams: PropTypes.shape({}),
  className: PropTypes.string,
};

export default BackBtn;
