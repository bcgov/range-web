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
  const { initial } = user;

  return (
    <div className={classnames('avatar', className)}>
      <div className="avatar__initial">
        {initial}
      </div>
    </div>
  );
};

Avatar.propTypes = propTypes;
Avatar.defaultProps = defaultProps;
export default Avatar;
