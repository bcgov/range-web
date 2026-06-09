// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getUserInitial } from '../../utils';

const propTypes = {
  user: PropTypes.shape({}),
  className: PropTypes.string,
};

const Avatar = ({ className = '', user = { familyName: 'N', givenName: 'P' } }) => (
  <div className={classnames('avatar', className)}>
    <div className="avatar__initial">{getUserInitial(user)}</div>
  </div>
);

Avatar.propTypes = propTypes;
export default Avatar;
