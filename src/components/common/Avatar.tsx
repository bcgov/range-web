import React from 'react';
import classnames from 'classnames';
import { getUserInitial } from '../../utils';

interface AvatarProps {
  user?: { familyName?: string; givenName?: string };
  className?: string;
}

function Avatar({ className = '', user = { familyName: 'N', givenName: 'P' } }: AvatarProps) {
  return (
    <div className={classnames('avatar', className)}>
      <div className="avatar__initial">{getUserInitial(user)}</div>
    </div>
  );
}

export default Avatar;
