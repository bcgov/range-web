import React from 'react'
import PropTypes from 'prop-types'
import { some, every } from 'lodash'
import permissions from '../../constants/permissions'
import { useUser } from '../../providers/UserProvider'
import { Input } from 'formik-semantic-ui'
import { Input as PlainInput, Form } from 'semantic-ui-react'
import { handleNullValue } from '../../utils'
import { useEditable } from '../../providers/EditableProvider'

export const canUserEdit = (field, user) =>
  permissions[user.roles[0]].includes(field)

const PermissionsField = ({
  permission,
  displayValue,
  component: Component = Input,
  editable = false,
  ...props
}) => {
  const user = useUser()
  const globalIsEditable = useEditable()

  return globalIsEditable && !editable && canUserEdit(permission, user) ? (
    <Component {...props} />
  ) : (
    <Form.Field inline={props.inline}>
      {props.label && <label>{props.label}</label>}
      <PlainInput
        aria-label={
          props['aria-label'] ||
          (props.inputProps && props.inputProps['aria-label'])
        }
        transparent
        value={handleNullValue(displayValue)}
        fluid={props.fluid}
      />
    </Form.Field>
  )
}

PermissionsField.propTypes = {
  permission: PropTypes.string.isRequired,
  displayValue: PropTypes.any,
  component: PropTypes.elementType,
  label: PropTypes.string,
  inline: PropTypes.bool,
  fluid: PropTypes.bool
}

export const IfEditable = ({ children, permission, invert, any = false }) => {
  const user = useUser()
  const globalIsEditable = useEditable()

  const arrayFn = any ? some : every

  const canEdit =
    (Array.isArray(permission)
      ? arrayFn(permission, p => canUserEdit(p, user))
      : canUserEdit(permission, user)) && globalIsEditable

  if (!invert && canEdit) return children
  if (invert && !canEdit) return children
  return null
}

IfEditable.propTypes = {
  children: PropTypes.node,
  permission: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    .isRequired,
  invert: PropTypes.bool
}

export default PermissionsField
