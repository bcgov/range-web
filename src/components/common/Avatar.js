import React from 'react';
export const Avatar = ({ name, className = "", isLabelHidden = false }) => (
  <div className={"avatar " + className}>
    <div className="avatar__initial">
      {name}
    </div>
  </div>
);  