import React from 'react';
import { shallow } from 'enzyme';
import { Navbar } from '../Navbar';

const props = {};
const setupProps = () => {
  props.onLogout = jest.fn();
};

beforeEach(() => {
  setupProps();
});

describe('Navbar', () => {
  it('render correctly', () => {
    const wrapper = shallow(<Navbar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('call `onLogout` when clicking on sign-out NavLink', () => {
    const wrapper = shallow(<Navbar {...props} />);
    wrapper.find('#sign-out').simulate('click', {}); 
    expect(props.onLogout).toHaveBeenCalled();
  });
});