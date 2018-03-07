import React from 'react';
import { shallow } from 'enzyme';
import { LandingPage } from '../LandingPage';

const props = {};
const setupProps = () => {
  props.location = {};
  props.match = {};
  props.history = {};
  props.component = jest.fn();
  props.logout = jest.fn();
};

beforeEach(() => {
  setupProps();
});

describe('LandingPage', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<LandingPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('call props.logout when clicking `sign out` menu', () => {
    const wrapper = shallow(<LandingPage {...props} />);
    wrapper.find('#sign-out').simulate('click', {}); 
    expect(props.logout).toHaveBeenCalled();
  });

  describe('Event handlers', () => {
    it('`onLogout` calls props.logout', () => {
      const wrapper = shallow(<LandingPage {...props} />);
      
      wrapper.instance().onLogout();
      expect(props.logout).toHaveBeenCalled();
    });
  });
});