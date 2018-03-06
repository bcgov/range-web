import React from 'react';
import classNames from 'classnames';

export const Avatar = ({ name, className = "" }) => (
  <div className={classNames('avatar', className)}>
    <div className="avatar__initial">
      {name}
    </div>
  </div>
);