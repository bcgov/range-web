import React from 'react';
import { shallow } from 'enzyme';
import ManageClient from '../ManageClient';

const props = {};
const setupProps = () => {
  props.users = [];
  props.clients = [];
  props.getClients = jest.fn();
  props.linkClient = jest.fn(() => Promise.resolve({}));
  props.clientLinked = jest.fn();
  props.isLinkingClient = false;
  props.isLoadingClients = false;
};

beforeEach(() => {
  setupProps();
});

describe('ManageClient', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<ManageClient {...props} />);
  });
});
