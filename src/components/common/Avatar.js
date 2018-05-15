import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

const Avatar = ({ className, user }) => {
  const { familyName, givenName } = user || {};
  let name = '';
  if (familyName && givenName
    && typeof familyName === 'string'
    && typeof givenName === 'string') {
    name = givenName.charAt(0) + familyName.charAt(0);
  }

  return (
    <div className={classnames('avatar', className)}>
      <div className="avatar__initial">
        {name}
      </div>
    </div>
  );
};

Avatar.propTypes = propTypes;
Avatar.defaultProps = defaultProps;
export default Avatar;
