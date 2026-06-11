import * as actionTypes from '../constants/actionTypes';
import { SEARCH_CLIENTS } from '../constants/reducerTypes';
import { Client, EntityMap } from '../types';

export interface ClientState {
  clients: EntityMap<Client>;
  clientIds: Array<string | number>;
}

interface ClientAction {
  type: string;
  name?: string;
  payload: {
    entities?: { clients?: EntityMap<Client> };
    result?: Array<string | number>;
  };
}

const initialState: ClientState = {
  clients: {},
  clientIds: [],
};

const storeClients = (state: ClientState, action: ClientAction): ClientState => {
  const { entities, result } = action.payload;
  const clients = entities?.clients ?? {};
  return {
    ...state,
    clients: {
      ...clients,
    },
    clientIds: [...(result ?? [])],
  };
};

const clientReducer = (state: ClientState = initialState, action: ClientAction): ClientState => {
  switch (action.type) {
    case actionTypes.REQUEST:
      if (action.name === SEARCH_CLIENTS) {
        return initialState;
      }
      return state;
    case actionTypes.STORE_CLIENTS:
      return storeClients(state, action);
    default:
      return state;
  }
};

export const getClients = (state: ClientState): Client[] =>
  state.clientIds.map((id) => state.clients[id]);
export const getClientsMap = (state: ClientState): EntityMap<Client> => state.clients;

export default clientReducer;
