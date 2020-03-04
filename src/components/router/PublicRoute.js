import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { HOME } from '../../constants/routes'

const propTypes = {
  component: PropTypes.elementType,
  user: PropTypes.object
}

const PublicRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (user) {
        return <Redirect push to={HOME} />
      }
      return <Component {...props} />
    }}
  />
)

PublicRoute.propTypes = propTypes

export default PublicRoute
