import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NOT_PROVIDED } from '../../constants/strings';

const propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
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
  text,
  isLabelHidden = false,
  isEditable = false,
  onClick,
}) => (
  <div className={classNames('text-field', className)}>
    <div className={classNames('text-field__label', { 'text-field__label--hidden': isLabelHidden })}>
      {label}
    </div>
    <div
      role="button"
      aria-pressed
      tabIndex={isEditable ? '0' : null}
      onClick={onClick}
      className={classNames('text-field__text', { 'text-field__text--editable': isEditable })}>
      {text || NOT_PROVIDED}
    </div>
  </div>
);

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;
export default TextField;
