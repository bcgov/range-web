import React from 'react';
import { shallow } from 'enzyme';
import { Login } from './Login';

const props = {};
const setupProps = () => {
  props.user = {
    id: 'id'
  };
  props.login = jest.fn();
  props.loginState = {};
  props.location = {
    search: {}
  }
};

beforeEach(() => {
  setupProps();
});

describe('Login', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Login {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});