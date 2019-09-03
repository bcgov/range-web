import React from 'react'
import PropTypes from 'prop-types'
import permissions from '../../constants/permissions'
import { useUser } from '../../providers/UserProvider'
import { Input } from 'formik-semantic-ui'
import { Input as PlainInput, Form } from 'semantic-ui-react'

export const canUserEdit = (field, user) =>
  permissions[user.roles[0]].includes(field)

const PermissionsField = ({
  permission,
  displayValue,
  component: Component = Input,
  ...props
}) => {
  const user = useUser()

  return canUserEdit(permission, user) ? (
    <Component {...props} />
  ) : (
    <Form.Field>
      <PlainInput transparent value={displayValue} />
    </Form.Field>
  )
}

PermissionsField.propTypes = {
  permission: PropTypes.string.isRequired,
  displayValue: PropTypes.any.isRequired,
  component: PropTypes.elementType
}

export const IfEditable = ({ children, permission, invert }) => {
  const user = useUser()

  const canEdit = canUserEdit(permission, user)

  if (!invert && canEdit) return children
  if (invert && !canEdit) return children
  return null
}

IfEditable.propTypes = {
  children: PropTypes.node,
  permission: PropTypes.string.isRequired,
  invert: PropTypes.bool
}

export default PermissionsField
