import React from 'react';
import { some, every } from 'lodash';
import permissions from '../../constants/permissions';
import { useUser } from '../../providers/UserProvider';
import { Input } from 'formik-semantic-ui';
import { Form } from 'semantic-ui-react';
import InfoTip from './InfoTip';
import { handleNullValue } from '../../utils';
import { useEditable } from '../../providers/EditableProvider';
import MultiParagraphDisplay from './MultiParagraphDisplay';
import type { User } from '../../types';

export const canUserEdit = (field: string, user: User): boolean =>
  (permissions as any)[user.roleId as any]?.includes(field) ?? false;

interface PermissionsFieldProps {
  permission: string;
  displayValue?: any;
  component?: React.ComponentType<any>;
  displayComponent?: React.ComponentType<any>;
  editable?: boolean;
  notProvided?: string;
  displayClassName?: string;
  tip?: string;
  label?: string;
  inline?: boolean;
  fluid?: boolean;
  inputProps?: Record<string, any>;
  'aria-label'?: string;
  [key: string]: any;
}

const PermissionsField: React.FC<PermissionsFieldProps> = ({
  permission,
  displayValue,
  component: Component = Input,
  displayComponent: DisplayComponent = MultiParagraphDisplay,
  editable = false,
  notProvided,
  displayClassName,
  ...props
}) => {
  const user = useUser();
  const globalIsEditable = useEditable();

  if (!user) return null;

  const AnyComponent = Component as React.ComponentType<any>;
  const AnyDisplayComponent = DisplayComponent as React.ComponentType<any>;

  return globalIsEditable && !editable && canUserEdit(permission, user) ? (
    <>
      {props.tip ? (
        <div className="rup__popup-header">
          <AnyComponent {...props} />
          {props.tip && <InfoTip header={props.label} content={props.tip} />}
        </div>
      ) : (
        <AnyComponent {...props} />
      )}
    </>
  ) : (
    <Form.Field inline={props.inline}>
      {props.label && (
        <div className="rup__popup-header">
          <label>{props.label}</label>
          {props.tip && <InfoTip header={props.label} content={props.tip} />}
        </div>
      )}
      <AnyDisplayComponent
        aria-label={props['aria-label'] || (props.inputProps && props.inputProps['aria-label'])}
        transparent
        value={handleNullValue(displayValue, true, notProvided) as string}
        fluid={props.fluid}
        className={displayClassName}
      />
    </Form.Field>
  );
};

interface IfEditableProps {
  children: React.ReactNode;
  permission: string | string[];
  invert?: boolean;
  any?: boolean;
}

export const IfEditable: React.FC<IfEditableProps> = ({ children, permission, invert, any: anyPerm = false }) => {
  const user = useUser();
  const globalIsEditable = useEditable();

  if (!user) return null;

  const arrayFn = anyPerm ? some : every;

  const canEdit =
    (Array.isArray(permission)
      ? arrayFn(permission, (p: string) => canUserEdit(p, user))
      : canUserEdit(permission, user)) && globalIsEditable;

  if (!invert && canEdit) return <>{children}</>;
  if (invert && !canEdit) return <>{children}</>;
  return null;
};

export default PermissionsField;
