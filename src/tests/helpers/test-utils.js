import React from 'react'
import { render } from '@testing-library/react'
import { UserContext } from '../../providers/UserProvider'
import { ReferencesContext } from '../../providers/ReferencesProvider'
import mockReference from '../intergration/mockData/mockReference'

const mockUser = {
  active: true,
  clientId: '09999905',
  email: 'range+client@twostoryrobot.com',
  familyName: 'Holder',
  givenName: 'Agreement',
  id: 76,
  lastLoginAt: '2019-11-13T02:22:36.794Z',
  phoneNumber: null,
  piaSeen: true,
  roles: ['myra_client'],
  username: 'dev_client'
}

const Wrapper = ({ children }) => {
  return (
    <ReferencesContext.Provider value={mockReference}>
      <UserContext.Provider value={mockUser}>{children}</UserContext.Provider>
    </ReferencesContext.Provider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: Wrapper, ...options })

export * from '@testing-library/react'

export { customRender as render }
