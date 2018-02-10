import React from 'react';
import { shallow } from 'enzyme';
import { Login } from './Login';

const props = {};
const setupProps = () => {
  props.user = {
    id: 'id'
  };
  props.login = jest.fn();
};

beforeEach(() => {
  setupProps();
});

describe('Login', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Login {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('initializes with the correct state', () => {
    const wrapper = shallow(<Login {...props} />);
    expect(wrapper.state()).toEqual({
      email: '',
      password: ''
    });
  });

  describe('Event handlers', () => {
    it('`handleInput` set states with given id and value', () => {
      const wrapper = shallow(<Login {...props} />);
      const mockId = 'email';
      const mockValue = 'value';
      wrapper.instance().handleInput({ target: { id: mockId, value: mockValue }});
      expect(wrapper.state()[mockId]).toEqual(mockValue);
    });

    // TODO test onSubmit
  });
});