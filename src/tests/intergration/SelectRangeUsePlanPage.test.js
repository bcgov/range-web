import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import thunk from 'redux-thunk'
import { MemoryRouter, withRouter } from 'react-router-dom'
import { axios } from '../../utils'
import SelectRangeUsePlanPage from '../../components/selectRangeUsePlanPage'
import { storeAuthData, storeUser, storeReferences } from '../../actions'
import { getAgreements } from '../../reducers/rootReducer'
import { configureMockStore, flushAllPromises } from '../helpers/utils'
import { ELEMENT_ID } from '../../constants/variables'
import {
  requestMockHeader,
  mockAgreements,
  mockAgreementPagination,
  mockReference,
  mockAuthData
} from './mockData'
import * as API from '../../constants/api'
import ToastProvider from '../../providers/ToastProvider'

jest.mock('lodash.debounce')

let store
const mockAxios = new MockAdapter(axios)
const mockUser = {
  id: 'user_id'
}

beforeEach(() => {
  store = configureMockStore([thunk])
  store.dispatch(storeAuthData(mockAuthData))
  store.dispatch(storeUser(mockUser))
  store.dispatch(storeReferences(mockReference))
  mockAxios.reset()
})

describe.skip('Integration testing', () => {
  it('Component initializes properly', async () => {
    const config = {
      ...requestMockHeader(store.getState),
      params: { term: '', page: 1, limit: 10 }
    }

    mockAxios.onGet(API.SEARCH_AGREEMENTS, config).reply(200, mockAgreements)

    const SelectRangeUsePlanWithRouter = withRouter(SelectRangeUsePlanPage)
    const wrapper = mount(
      <Provider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={['/home']}>
            <SelectRangeUsePlanWithRouter />
          </MemoryRouter>
        </ToastProvider>
      </Provider>
    )

    await flushAllPromises()
    wrapper.update()

    expect(getAgreements(store.getState())).toHaveLength(10)
  })

  describe.skip('Browse functionalities', () => {
    it('search agreements by RAN075974', async () => {
      let config = {
        ...requestMockHeader(store.getState),
        params: { term: '', page: 1, limit: 10 }
      }
      mockAxios.onGet(API.SEARCH_AGREEMENTS, config).reply(200, mockAgreements)
      config = { ...config, params: { term: 'RAN075974', page: 1, limit: 10 } }
      mockAxios
        .onGet(API.SEARCH_AGREEMENTS, config)
        .reply(200, mockAgreementPagination)

      const SelectRangeUsePlanWithRouter = withRouter(SelectRangeUsePlanPage)
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/home']}>
            <SelectRangeUsePlanWithRouter />
          </MemoryRouter>
        </Provider>
      )
      await flushAllPromises()
      wrapper.update()

      expect(getAgreements(store.getState())).toHaveLength(10)

      wrapper.find(`#${ELEMENT_ID.SEARCH_TERM}`).simulate('change', {
        target: { id: ELEMENT_ID.SEARCH_TERM, value: 'RAN075974' }
      })
      await flushAllPromises()
      wrapper.update()

      expect(getAgreements(store.getState())).toHaveLength(1)
    })
  })
})
