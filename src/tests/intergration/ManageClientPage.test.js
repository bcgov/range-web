import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import { groupBy } from 'lodash'
import {
  render,
  queryAllByText as globalQueryAllByText,
  queryByText as globalQueryByText,
  waitFor,
  within
} from '../helpers/test-utils'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, withRouter } from 'react-router-dom'
import { axios, getUserFullName } from '../../utils'
import ManageClientPage from '../../components/manageClientPage'
import { mockUsers, mockClients } from './mockData'
import * as API from '../../constants/api'

// Group mock users by full name
const usersByName = groupBy(mockUsers, user => getUserFullName(user))

const mockAxios = new MockAdapter(axios)

jest.useFakeTimers()

beforeEach(() => {
  mockAxios.reset()
})

describe('Manage client page', () => {
  it('Loads a dropdown populated with users', async () => {
    mockAxios.onGet(new RegExp(API.GET_USERS)).reply(200, mockUsers)

    const ManageClientWithRouter = withRouter(ManageClientPage)
    const { getByLabelText, getByRole } = render(
      <MemoryRouter initialEntries={['manage-client']}>
        <ManageClientWithRouter />
      </MemoryRouter>
    )

    await waitFor(() => expect(getByRole('progressbar')).toBeInTheDocument())

    const userSelect = await waitFor(() => getByLabelText('Select user'))
    expect(userSelect).toBeInTheDocument()

    const openButton = await getByLabelText('Open')

    userEvent.click(openButton)

    const listBox = getByRole('listbox')

    Object.entries(usersByName).forEach(([name, users]) => {
      const userOptions = globalQueryAllByText(listBox, name)
      expect(userOptions).toHaveLength(users.length)
    })
  })

  it('Searches the list of users when you type', async () => {
    const searchText = 'Agreement Holder'
    const searchRegex = new RegExp(searchText)

    mockAxios.onGet(new RegExp(API.GET_USERS)).reply(200, mockUsers)

    const ManageClientWithRouter = withRouter(ManageClientPage)
    const { getByRole, findByLabelText } = render(
      <MemoryRouter initialEntries={['manage-client']}>
        <ManageClientWithRouter />
      </MemoryRouter>
    )

    const userSelect = await findByLabelText('Select user')
    expect(userSelect).toBeInTheDocument()

    // Search for a user
    userEvent.type(userSelect, searchText)

    const listBox = getByRole('listbox')

    const userOption = globalQueryByText(listBox, searchRegex)
    expect(userOption).toBeInTheDocument()

    Object.entries(usersByName).forEach(([name]) => {
      // Make sure only options that match the typed in text appear in the list
      if (!name.match(searchRegex)) {
        const userOptions = globalQueryAllByText(listBox, name)
        expect(userOptions).toHaveLength(0)
      } else {
        const ahOption = globalQueryByText(listBox, name)
        expect(ahOption).toBeInTheDocument(0)
      }
    })
  })

  it('Allows you to choose a user', async () => {
    mockAxios.onGet(new RegExp(API.GET_USERS)).reply(200, mockUsers)
    mockAxios.onGet(new RegExp(API.SEARCH_CLIENTS)).reply(200, mockClients)

    const ManageClientWithRouter = withRouter(ManageClientPage)
    const { getByLabelText, findByLabelText, getByRole } = render(
      <MemoryRouter initialEntries={['manage-client']}>
        <ManageClientWithRouter />
      </MemoryRouter>
    )

    const userSelect = await findByLabelText('Select user')
    expect(userSelect).toBeInTheDocument()
    expect(userSelect).not.toHaveValue()

    const openButton = await getByLabelText('Open')

    userEvent.click(openButton)

    const listBox = getByRole('listbox')

    const userOption = globalQueryByText(listBox, /Agreement Holder 1/g)
    expect(userOption).not.toBeNull()

    userEvent.click(userOption)

    await waitFor(() => {
      expect(userSelect).toHaveValue('Agreement Holder 1 Range')
    })
  })

  it('Shows existing links for a user', async () => {
    const mockUser = mockUsers.find(
      user => getUserFullName(user) === 'April Ludgate'
    )

    mockAxios.onGet(new RegExp(`${API.GET_USERS}/\\?.*`)).reply(200, mockUsers)
    mockAxios.onGet(new RegExp(API.SEARCH_CLIENTS)).reply(200, mockClients)
    mockAxios.onGet(`${API.GET_USERS}/${mockUser.id}`).reply(200, {
      ...mockUser,
      clients: mockUser.clients.map(clientId =>
        mockClients.find(c => c.ids.includes(clientId))
      )
    })

    const ManageClientWithRouter = withRouter(ManageClientPage)
    const { findByLabelText, getByRole, queryByText, getByText } = render(
      <MemoryRouter initialEntries={['manage-client']}>
        <ManageClientWithRouter />
      </MemoryRouter>
    )

    const userSelect = await findByLabelText('Select user')
    userEvent.click(userSelect)

    const listBox = getByRole('listbox')

    const userOption = within(listBox).queryByText(/April Ludgate/g)
    expect(userOption).not.toBeNull()

    userEvent.click(userOption)

    await waitFor(() => {
      expect(userSelect).toHaveValue('April Ludgate')
    })

    expect(queryByText('No clients linked')).not.toBeInTheDocument()
    expect(getByText(/Tom Haverford/g)).toBeInTheDocument()
  })

  it('Displays if there was an error linking clients, and hides the error if a different client is selected', async () => {
    const mockUser = mockUsers.find(
      user => getUserFullName(user) === 'April Ludgate'
    )

    mockAxios.onGet(new RegExp(`${API.GET_USERS}/\\?.*`)).reply(200, mockUsers)
    mockAxios.onGet(new RegExp(API.SEARCH_CLIENTS)).reply(200, mockClients)
    mockAxios.onGet(`${API.GET_USERS}/${mockUser.id}`).reply(200, {
      ...mockUser,
      clients: mockUser.clients.map(clientId =>
        mockClients.find(c => c.ids.includes(clientId))
      )
    })
    mockAxios.onPost(`${API.CREATE_USER_CLIENT_LINK(mockUser.id)}`).reply(400, {
      error: 'Error linking client'
    })

    const ManageClientWithRouter = withRouter(ManageClientPage)
    const { findByLabelText, getByRole, getByText, queryByText } = render(
      <MemoryRouter initialEntries={['manage-client']}>
        <ManageClientWithRouter />
      </MemoryRouter>
    )

    // Chose April Ludgate as the user to manage
    const userSelect = await findByLabelText('Select user')
    userEvent.click(userSelect)

    const userListbox = getByRole('listbox')
    userEvent.click(within(userListbox).queryByText(/April Ludgate/g))

    await waitFor(() => {
      expect(userSelect).toHaveValue('April Ludgate')
    })

    // Open the select client dropdown
    const clientSelect = await findByLabelText('Select client')
    expect(clientSelect).toBeInTheDocument()
    userEvent.click(clientSelect)

    // Try to add a link
    userEvent.click(within(getByRole('listbox')).getByText(/Tom Haverford/g))
    userEvent.click(getByText('Add link'))

    await waitFor(() =>
      expect(getByText(/Error linking client/g)).toBeInTheDocument()
    )

    // Error message should disappear after selecting a different client
    userEvent.click(clientSelect)
    userEvent.click(within(getByRole('listbox')).getByText(/April Ludgate/g))

    expect(queryByText(/Error linking client/g)).not.toBeInTheDocument()
  })
})
