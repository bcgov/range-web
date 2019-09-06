import React, { useState } from 'react'
import { UserContext } from '../../src/providers/UserProvider'
import user from '../mocks/user'
import addons, { makeDecorator } from '@storybook/addons'

const UserProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('myra_range_officer')

  const channel = addons.getChannel()

  channel.on('role/change', role => {
    console.log(role)

    setCurrentRole(role)
  })

  return (
    <UserContext.Provider
      value={{
        ...user,
        roles: [currentRole]
      }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
