import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const Avatar = ({ name, className = '' }) => (
  <div className={classNames('avatar', className)}>
    <div className="avatar__initial">
      {name}
    </div>
  </div>
);

Avatar.propTypes = propTypes;
export default Avatar;
