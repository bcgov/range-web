import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { presentNullValue } from '../../handlers';

const propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
  isLabelHidden: PropTypes.bool,
  isEditable: PropTypes.bool,
  onClick: PropTypes.func,
};

const defaultProps = {
  className: '',
  text: '',
  isLabelHidden: false,
  isEditable: false,
  onClick: () => {},
};

const TextField = ({
  className,
  label,
  text: rawText,
  isLabelHidden = false,
  isEditable = false,
  onClick,
}) => {
  const text = presentNullValue(rawText);

  return (
    <div className={classnames('text-field', className)}>
      <div className={classnames('text-field__label', { 'text-field__label--hidden': isLabelHidden })}>
        {label}
      </div>
      <div
        role="button"
        aria-pressed
        tabIndex={isEditable ? '0' : null}
        onClick={onClick}
        className={classnames('text-field__text', { 'text-field__text--editable': isEditable })}
      >
        {text}
      </div>
    </div>
  );
};

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;
export default TextField;
