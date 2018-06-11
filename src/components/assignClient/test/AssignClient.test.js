import React from 'react';
import { shallow } from 'enzyme';
import AssignClient from '../AssignClient';

const props = {};
const setupProps = () => {
  props.users = [];
  props.clients = [];
  props.getClients = jest.fn();
  props.assignClient = jest.fn(() => Promise.resolve({}));
  props.clientAssigned = jest.fn();
  props.isAssigning = false;
  props.isLoadingClients = false;
};

beforeEach(() => {
  setupProps();
});

describe('AssignClient', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<AssignClient {...props} />);
  });
});
