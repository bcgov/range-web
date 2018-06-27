import * as actionTypes from '../constants/actionTypes';

const initialState = {
  clients: {},
  clientIds: [],
};

const storeClients = (state, action) => {
  const { entities, result } = action.payload;
  const { clients } = entities;
  return {
    ...state,
    clients: {
      ...clients,
    },
    clientIds: [
      ...result,
    ],
  };
};

const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STORE_CLIENTS:
      return storeClients(state, action);
    default:
      return state;
  }
};
export const getClients = state => state.clientIds.map(id => state.clients[id]);
export const getClientsMap = state => state.clients;

export default clientReducer;
