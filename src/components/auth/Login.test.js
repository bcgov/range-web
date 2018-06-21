import React from 'react';
import { shallow } from 'enzyme';
import { Login } from './Login';
import { SSO_LOGIN_ENDPOINT } from '../../constants/api';

const props = {};
const setupProps = () => {
  props.login = jest.fn();
  props.loginState = {};
  props.user = {};
  props.location = {
    search: '',
  };
};

beforeEach(() => {
  setupProps();
});

describe('Login', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Login {...props} />);
  });

  it('opens a new tab when clicking on Login button', () => {
    global.window.open = jest.fn();
    const wrapper = shallow(<Login {...props} />);

    wrapper.find('#login-button').simulate('click', {});
    expect(global.window.open).toHaveBeenCalledWith(SSO_LOGIN_ENDPOINT, '_self');
  });

  describe('Life cycles', () => {
    it('componentDidmount', () => {
      const mockCode = 'hhAvWWCcAztaAfswBN4XHbPPgiplWk8UtY5Lhs';
      props.location = {
        search: `?code=${mockCode}`,
      };
      const wrapper = shallow(<Login {...props} />);
      wrapper.instance().componentDidMount();

      const { login } = props;
      expect(login).toHaveBeenCalledWith(mockCode);
    });
  });
});
