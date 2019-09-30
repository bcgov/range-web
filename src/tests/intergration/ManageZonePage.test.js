import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { MemoryRouter, withRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import { normalize } from 'normalizr'
import { axios, getContactOption, getZoneOption } from '../../utils'
import ManageZonePage from '../../components/manageZonePage'
import { storeAuthData, storeReferences, storeZones } from '../../actions'
import { configureMockStore, flushAllPromises } from '../helpers/utils'
import {
  requestMockHeader,
  mockUsers,
  mockReference,
  mockZones,
  mockAuthData
} from './mockData'
import * as API from '../../constants/api'
import * as schema from '../../actionCreators/schema'

let store
const mockAxios = new MockAdapter(axios)

beforeEach(() => {
  store = configureMockStore([thunk])
  store.dispatch(storeAuthData(mockAuthData))
  store.dispatch(storeReferences(mockReference))
  store.dispatch(storeZones(normalize(mockZones, schema.arrayOfZones)))
  mockAxios.reset()
})

describe('Integration testing', () => {
  it('Component initializes properly', async () => {
    const config = {
      ...requestMockHeader(store.getState)
    }

    mockAxios.onGet(API.GET_USERS, config).reply(200, mockUsers)
    mockAxios.onGet(API.GET_ZONES, config).reply(200, mockZones)

    const ManageZoneWithRouter = withRouter(ManageZonePage)
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['manage-zone']}>
          <ManageZoneWithRouter />
        </MemoryRouter>
      </Provider>
    )

    expect(wrapper.find('DropdownItem')).toHaveLength(mockZones.length)

    await flushAllPromises()
    wrapper.update()

    expect(wrapper.find('DropdownItem')).toHaveLength(
      mockZones.length + mockUsers.length
    )
  })

  it('Select each option in two dropdowns and see if the update button is enabled', async () => {
    const config = {
      ...requestMockHeader(store.getState)
    }
    const mockContact = mockUsers[3]
    const mockZone = mockZones[12]

    mockAxios.onGet(API.GET_USERS, config).reply(200, mockUsers)
    mockAxios.onGet(API.GET_ZONES, config).reply(200, mockZones)
    mockAxios.onPut(
      API.UPDATE_USER_ID_OF_ZONE(mockZone.id),
      { userId: mockContact.id },
      config
    )

    const ManageZoneWithRouter = withRouter(ManageZonePage)
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['manage-zone']}>
          <ManageZoneWithRouter />
        </MemoryRouter>
      </Provider>
    )

    await flushAllPromises()
    wrapper.update()

    const updateButtonProp = {
      disabled: true,
      primary: true,
      content: 'Link Zone'
    }
    expect(wrapper.find(updateButtonProp)).toHaveLength(1)

    // select a zone and a contact in dropdowns
    const zoneOption = getZoneOption(mockZone)
    const contactOption = getContactOption(mockContact)
    wrapper.find({ text: zoneOption.text }).simulate('click')
    wrapper.find({ description: contactOption.description }).simulate('click')

    updateButtonProp.disabled = false
    expect(wrapper.find(updateButtonProp)).toHaveLength(1)

    wrapper.find(updateButtonProp).simulate('click')
  })
})
