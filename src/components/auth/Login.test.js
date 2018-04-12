import React from 'react';
import { shallow } from 'enzyme';
import { Login } from './Login';
import { SSO_AUTH_ENDPOINT } from '../../constants/api';

const props = {};
const setupProps = () => {
  props.login = jest.fn();
  props.loginState = {};
  props.location = {
    search: '',
  };
};

beforeEach(() => {
  setupProps();
});

describe('Login', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<Login {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('opens a new tab when clicking on Login button', () => {
    global.window.open = jest.fn();
    const wrapper = shallow(<Login {...props} />);

    wrapper.find('Button').simulate('click', {});
    expect(global.window.open).toHaveBeenCalledWith(SSO_AUTH_ENDPOINT, '_self'); 
  });

  describe('Life cycles', () => {
    it('componentDidmount', () => {
      const mockCode = 'hhAvWWCcAztaAfswBN4XHbPPgiplWk8UtY5Lhs';
      props.location = {
        search: `?code=${mockCode}`,
      };
      const wrapper = shallow(<Login {...props} />);
      const { login } = props;
      expect(login).toHaveBeenCalledWith(mockCode);
    });
  });
});