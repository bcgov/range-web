import React from 'react';
import { Icon } from 'semantic-ui-react';
import classnames from 'classnames';
import { handleNullValue } from '../../utils';

interface TextFieldProps {
  className?: string;
  label: string;
  text?: React.ReactNode | string | number;
  isLabelHidden?: boolean;
  isEditable?: boolean;
  onClick?: () => void;
}

const TextField: React.FC<TextFieldProps> = ({
  className = '',
  label,
  text: rawText = '',
  isLabelHidden = false,
  isEditable = false,
  onClick = () => undefined,
}) => {
  const text = handleNullValue(rawText) as React.ReactNode;

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

export default TextField;
