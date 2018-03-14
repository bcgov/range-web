import React from 'react';
import classNames from 'classnames';
import { NOT_PROVIDED } from '../../constants/strings';

export const TextField = ({ label, text, className = "", isLabelHidden = false }) => (
  <div className={classNames('text-field', className)}>
    <div 
      className={classNames('text-field__label', {'text-field__label--hidden': isLabelHidden })}
    >
      {label}
    </div>
    <div className="text-field__text">
      {text || NOT_PROVIDED}
    </div>
  </div>
);