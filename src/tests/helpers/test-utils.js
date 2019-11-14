import React from 'react'
import { render, getAllByRole } from '@testing-library/react'
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

// Relies too much on the implementation details of semantic-ui's <Dropdown />.
// Eventually, a better dropdown component should be used that allows us to
// simply get the value via `dropdownElement.value`.
export const getSemanticDropdownValue = dropdownElement => {
  const options = getAllByRole(dropdownElement, 'option')
  const selected = options.find(
    o =>
      o.getAttribute('aria-selected') === 'true' ||
      o.getAttribute('aria-checked') === 'true'
  )

  if (selected) return selected.textContent
  return null
}

export * from '@testing-library/react'

export { customRender as render }
