import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';

import { axios } from '../../utils';
import Home from '../../components/Home';
import { storeAuthData, storeUser } from '../../actions';
import { getAgreements } from '../../reducers/rootReducer';
import { configureMockStore, flushAllPromises } from '../helpers/utils';
import { mockRequestHeader, mockAgreements } from './mockData';
import * as API from '../../constants/API';

let store;
const mockAxios = new MockAdapter(axios);
const mockAuthData = {
  access_token: 'mockToken',
};
const mockUser = {
  id: 'user_id',
};
beforeEach(() => {
  store = configureMockStore([thunk]);
  store.dispatch(storeAuthData(mockAuthData));
  store.dispatch(storeUser(mockUser));
  mockAxios.reset();
});

/* eslint-disable function-paren-newline */
describe('Integration testing', () => {
  it('Component initializes properly', async () => {
    const config = {
      ...mockRequestHeader(mockAuthData.access_token),
      params: { term: '', page: 1, limit: 10 },
    };

    mockAxios.onGet(API.SEARCH_AGREEMENTS_ENDPOINT, config).reply(200, mockAgreements);
    const wrapper = mount(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    await flushAllPromises();
    // Forces a re-render
    wrapper.update();
    expect(getAgreements(store.getState())).toHaveLength(10);
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
