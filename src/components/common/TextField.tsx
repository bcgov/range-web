// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import classnames from 'classnames';
import { handleNullValue } from '../../utils';

const propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
  isLabelHidden: PropTypes.bool,
  isEditable: PropTypes.bool,
  onClick: PropTypes.func,
};

const TextField = ({
  className = '',
  label,
  text: rawText = '',
  isLabelHidden = false,
  isEditable = false,
  onClick = () => undefined,
}) => {
  const text = handleNullValue(rawText);

  return (
    <div className={classnames('text-field', className)}>
      <div
        className={classnames('text-field__label', {
          'text-field__label--hidden': isLabelHidden,
        })}
      >
        {label}
      </div>

      {isEditable && (
        <button className="text-field__button" onClick={onClick}>
          {text}
          <Icon name="pencil" />
        </button>
      )}

      {!isEditable && <div className="text-field__text">{text}</div>}
    </div>
  );
};

TextField.propTypes = propTypes;
export default TextField;
