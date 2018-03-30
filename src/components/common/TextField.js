import React from 'react';
import classNames from 'classnames';
import { NOT_PROVIDED } from '../../constants/strings';

export const TextField = ({ 
  className = "",
  label, 
  text, 
  isLabelHidden = false,
  isEditable = false,
  onClick 
  }) => (
  <div className={classNames('text-field', className)} onClick={onClick}>
    <div 
      className={classNames('text-field__label', { 'text-field__label--hidden': isLabelHidden })}
    >
      {label}
    </div>
    <div className={classNames("text-field__text", { 'text-field__text--editable': isEditable})}>
      {text || NOT_PROVIDED}
    </div>
  </div>
);