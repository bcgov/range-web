import React from 'react';
import { shallow } from 'enzyme';
import { Navbar } from '../Navbar';
import { SSO_AUTH_LOGOUT_ENDPOINT } from '../../constants/api';

const props = {};
const setupProps = () => {
  props.onLogout = jest.fn();
};

beforeEach(() => {
  setupProps();
});

describe('Navbar', () => {
  xit('render correctly', () => {
    const wrapper = shallow(<Navbar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('call `onLogout` when clicking on sign-out NavLink', () => {
    global.window.open = jest.fn();
    const wrapper = shallow(<Navbar {...props} />);
    wrapper.find('#sign-out').simulate('click', {});
    expect(global.window.open).toHaveBeenCalledWith(SSO_AUTH_LOGOUT_ENDPOINT, '_self');
  });
});
