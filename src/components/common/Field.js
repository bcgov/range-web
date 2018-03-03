import React from 'react';
export const Field = ({ label, input, className = "", isLabelHidden = false }) => (
  <div className={`field ${className}`}>
    <label 
      className={"field__label" + (isLabelHidden ? " field__label--hidden" : "")}
    >
      {label}
    </label>
    <div className="field__input">
      {input}
    </div>
  </div>
);