import React from 'react';
import { some, every, omit } from 'lodash';
import { useField } from 'formik';
import permissions from '../../constants/permissions';
import { useUser } from '../../providers/UserProvider';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
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

function DefaultField(props: any) {
  const { name, label, ...rest } = props;
  const [field, meta] = useField(name || '');

  return (
    <TextField
      {...field}
      {...rest}
      label={label}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
      fullWidth
      size="small"
    />
  );
}

function PermissionsField({
  permission,
  displayValue,
  component: Component = DefaultField,
  displayComponent: DisplayComponent = MultiParagraphDisplay,
  editable = false,
  notProvided,
  displayClassName,
  ...props
}: PermissionsFieldProps) {
  const user = useUser();
  const globalIsEditable = useEditable();

  if (!user) return null;

  const AnyComponent = Component as React.ComponentType<any>;
  const AnyDisplayComponent = DisplayComponent as React.ComponentType<any>;

  return globalIsEditable && !editable && canUserEdit(permission, user) ? (
    <>
      {props.label && !props.inline && (
        <div className="rup__popup-header">
          <Typography variant="body2" component="label" sx={{ fontWeight: 500 }}>
            {props.label.endsWith(' *') ? props.label.slice(0, -2) : props.label}
            {props.label.endsWith(' *') && <span style={{ color: 'red' }}> *</span>}
          </Typography>
          {props.tip && <InfoTip header={props.label} content={props.tip} />}
        </div>
      )}
      <AnyComponent {...(props.inline ? props : omit(props, ['label', 'tip']))} />
    </>
  ) : (
    <FormControl sx={{ m: 0, display: 'block' }}>
      {props.label && (
        <div className="rup__popup-header">
          <Typography variant="body2" component="label" sx={{ fontWeight: 500 }}>
            {props.label.endsWith(' *') ? props.label.slice(0, -2) : props.label}
            {props.label.endsWith(' *') && <span style={{ color: 'red' }}> *</span>}
          </Typography>
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
      {props.error && <FormHelperText>{props.error}</FormHelperText>}
    </FormControl>
  );
}

interface IfEditableProps {
  children: React.ReactNode;
  permission: string | string[];
  invert?: boolean;
  any?: boolean;
}

export function IfEditable({ children, permission, invert, any: anyPerm = false }: IfEditableProps) {
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
}

export default PermissionsField;
