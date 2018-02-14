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
      username: '',
      password: ''
    });
  });

  describe('when loggin in', () => {
    const username = 'username';
    const password = 'password';
    
    it('update the local `username` state', () => {
      const wrapper = shallow(<Login {...props} />);
      wrapper.find('input#username').simulate('change', { target: { id: username, value: username }});
      expect(wrapper.state().username).toEqual(username);      
    });

    it('update the local `password` state', () => {
      const wrapper = shallow(<Login {...props} />);
      wrapper.find('input#password').simulate('change', { target: { id: password, value: password }});
      expect(wrapper.state().password).toEqual(password);      
    });

    it('call `login` prop when clicking on the login button', () => {
      const mockIsValid = true;
      Login.prototype.isInputsValid = jest.fn().mockReturnValue(mockIsValid);
      const wrapper = shallow(<Login {...props} />);
      
      wrapper.find('Button').simulate('click', { preventDefault: jest.fn() });
      expect(props.login).toHaveBeenCalled();
    });
  });

  describe('Event handlers', () => {
    it('`handleInput` set states with given id and value correctly', () => {
      const wrapper = shallow(<Login {...props} />);
      const mockId = 'username';
      const mockValue = 'value';
      wrapper.instance().handleInput({ target: { id: mockId, value: mockValue }});
      expect(wrapper.state()[mockId]).toEqual(mockValue);
    });

    it('`onSubmit` validate inputs and login correctly', () => {
      const mockIsValid = true;
      Login.prototype.isInputsValid = jest.fn().mockReturnValue(mockIsValid);
      const wrapper = shallow(<Login {...props} />);
      const instance = wrapper.instance();

      instance.onSubmit({ preventDefault: jest.fn() });
      expect(props.login).toHaveBeenCalled();
    });
  });
});