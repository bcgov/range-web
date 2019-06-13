import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { MemoryRouter, withRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import { axios } from '../../utils'
import LoginPage from '../../components/loginPage'
import { configureMockStore, flushAllPromises } from '../helpers/utils'

let store
const mockAxios = new MockAdapter(axios)

beforeEach(() => {
  store = configureMockStore([thunk])
  mockAxios.reset()
})

describe('Integration testing', () => {
  it('Component initializes properly', async () => {
    const LoginPageWithRouter = withRouter(LoginPage)
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['login']}>
          <LoginPageWithRouter />
        </MemoryRouter>
      </Provider>
    )

    await flushAllPromises()
    wrapper.update()
  })
})
