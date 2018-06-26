import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { MemoryRouter, Switch, Route, BrowserRouter } from 'react-router-dom';

import Router from '../../components/Router';
import Home from '../../components/Home';
import Agreement from '../../components/agreement';
import { storeAuthData } from '../../actions';
import { configureMockStore, flushAllPromises } from '../helpers/utils';
import { mockRequestHeader, mockAgreements } from './mockData';
import * as API from '../../constants/API';

let store;
const mockAxios = new MockAdapter(axios);
const mockToken = 'mockToken';

beforeEach(() => {
  store = configureMockStore([thunk]);
  store.dispatch(storeAuthData('mockToken'));
  mockAxios.reset();
});

describe('Integration testing', () => {
  it('Component initializes properly', async () => {
    const config = {
      ...mockRequestHeader(mockToken),
      params: { term: '', page: 1, limit: 10 },
    };
    mockAxios.onGet(API.SEARCH_AGREEMENTS_ENDPOINT, config).reply(200, mockAgreements);
    // const props = {
    //   location: {
    //     search: '',
    //     pathname: '/home',
    //   },
    //   history: {
    //     push: jest.fn(),
    //   },
    // };
    // const wrapper = mount(
    //   <Provider store={store}>
    //     <Home />
    //   </Provider>,
    // );
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/home']} initialIndex={0}>
          <BrowserRouter>
            <Switch>
              <Route path="/home" component={Home} />
            </Switch>
          </BrowserRouter>
        </MemoryRouter>
      </Provider>,
    );
    await flushAllPromises();
    // Forces a re-render
    wrapper.update();
    console.log(wrapper.props());
    console.log(store.getState().AGREEMENTS);
    // expect(store.getState().AGREEMENTS).toHaveLength(10);
  });
//   describe('Browse functionalities', () => {
//     const query = "test";
//     const filterType = "album";
//     const mockSearchAlbumResponse = {
//       albums: {
//         items: mockFetchSavedAlbumsResponse.items.map(item => item.album),
//       },
//     };
//     let wrapper;

//     beforeEach(() => {
//       mockAxios
//       .onGet(API.GET_LIBRARY_LINK(), mockRequestHeader).reply(200, mockFetchSavedAlbumsResponse)
//       .onGet(API.SEARCH_LINK(query, filterType), mockRequestHeader).reply(200, mockSearchAlbumResponse);

//       wrapper = mount(
//         <Provider store={store}>
//           <Home />
//         </Provider>
//       );
//       wrapper.find('.form-control').simulate('change', {target: { value: 'test' }});
//       wrapper.find('button').simulate('submit');
//     });

//     it('Submits query and searchs for albums', async () => {
//       await flushAllPromises();
//       wrapper.update();

//       expect(wrapper.find('.card')).toHaveLength(3);
//       expect(wrapper.find('.artist-filter button')).toHaveLength(3);

//       expect(wrapper.find('.artist-filter button').at(0).text()).toEqual('All');
//       expect(wrapper.find('.artist-filter button').at(1).text()).toEqual('A.A.L');
//       expect(wrapper.find('.artist-filter button').at(2).text()).toEqual('Alvvays');

//       expect(wrapper.find('.card button').at(0).text()).toEqual("Remove");
//       expect(wrapper.find('.card button').at(1).text()).toEqual("Remove");
//       expect(wrapper.find('.card button').at(2).text()).toEqual("Remove");
//     });

//     it('Favoriting/Unfavoriting an album adds/removes the album from the library', async () => {
//       const albumId = "1uzfGk9vxMXfaZ2avqwxod";
//       mockAxios
//         .onPut(API.ADD_LIBRARY_ALBUM_LINK(), [albumId]).reply(200, { success: true })
//         .onAny(API.DELETE_LIBRARY_ALBUM_LINK(albumId), mockRequestHeader).reply(200, { success: true });

//       await flushAllPromises();
//       wrapper.update();
//       //Should have the same 3 albums in library and search results
//       expect(store.getState().LIBRARY.albumIds).toHaveLength(3);

//       //Unfavorite the first album
//       wrapper.find('.card button').at(0).simulate('click');

//       await flushAllPromises();
//       wrapper.update();
//       //Now there should be only 2 albums in library
//       expect(store.getState().LIBRARY.albumIds).toHaveLength(2);
//       expect(store.getState().LIBRARY.albumIds.indexOf("1uzfGk9vxMXfaZ2avqwxod")).toEqual(-1);

//       //Favorite the same album again
//       wrapper.find('.card button').at(0).simulate('click');

//       await flushAllPromises();
//       wrapper.update();

//       //Those albums should reappear in the library again
//       expect(store.getState().LIBRARY.albumIds).toHaveLength(3);
//       expect(store.getState().LIBRARY.albumIds.indexOf("1uzfGk9vxMXfaZ2avqwxod")).toBeGreaterThan(0);
//     });

//     it('Click an artist filter will filter the search results', async () => {
//       const artistId = "329iU5aUf9pGiYFbjE9xqQ";
//       mockAxios.onGet(API.GET_ARTIST_LINK(artistId), mockRequestHeader).reply(200, mockArtistResponse);

//       await flushAllPromises();
//       wrapper.update();
//       expect(wrapper.find('.card')).toHaveLength(3);

//       wrapper.find('.artist-filter button').filterWhere(node => node.text() === 'A.A.L').simulate('click');

//       await flushAllPromises();
//       wrapper.update();
//       expect(wrapper.find('.card')).toHaveLength(1);
//       expect(wrapper.find('.artist-info')).toHaveLength(1);
//     });
//   });
});
