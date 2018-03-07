import React from 'react';
import classNames from 'classnames';

export const TextField = ({ label, text, className = "", isLabelHidden = false }) => (
  <div className={classNames('text-field', className)}>
    <div 
      className={classNames('text-field__label', {'field__label--hidden': isLabelHidden })}
    >
      {label}
    </div>
    <div className="text-field__text">
      {text}
    </div>
  </div>
);