import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import User from '../../models/User';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

const Avatar = ({ className, user: u }) => {
  const { initial } = new User(u);

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
