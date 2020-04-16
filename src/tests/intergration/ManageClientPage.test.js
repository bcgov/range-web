import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import { groupBy } from 'lodash'
import {
  render,
  queryAllByText as globalQueryAllByText,
  queryByText as globalQueryByText,
  waitFor
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

// global.document.createRange = () => ({
//   setStart: () => {},
//   setEnd: () => {},
//   commonAncestorContainer: {
//     nodeName: 'BODY',
//     ownerDocument: document
//   }
// })

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

    expect(getByRole('progressbar')).toBeInTheDocument()

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
    const { getByLabelText, getByRole } = render(
      <MemoryRouter initialEntries={['manage-client']}>
        <ManageClientWithRouter />
      </MemoryRouter>
    )

    const userSelect = await waitFor(() => getByLabelText('Select user'))
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
    const {
      getByLabelText,
      getAllByRole,
      getByRole,
      debug,
      queryByText
    } = render(
      <MemoryRouter initialEntries={['manage-client']}>
        <ManageClientWithRouter />
      </MemoryRouter>
    )

    const userSelect = await waitFor(() => getByLabelText('Select user'))
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
})
