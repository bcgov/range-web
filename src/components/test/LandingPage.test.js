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

  it('sidebar and overlay should appear or not depending on `isSidebarHidden` state', () => {
    const wrapper = shallow(<LandingPage {...props} />);
    expect(wrapper.find('.overlay--hidden').exists()).toBe(true);
    expect(wrapper.find('.sidebar--hidden').exists()).toBe(true);
    
    wrapper.setState({ isSidebarHidden: false });
    expect(wrapper.find('.overlay--hidden').exists()).toBe(false);
    expect(wrapper.find('.sidebar--hidden').exists()).toBe(false);
  });

  describe('Event handlers', () => {
    it('`toggleSidebar` set `isSidebarHidden` state correctly', () => {
      const wrapper = shallow(<LandingPage {...props} />);
      const prevIsSidebarHidden = wrapper.state().isSidebarHidden;

      wrapper.instance().toggleSidebar();
      expect(wrapper.state().isSidebarHidden).toEqual(!prevIsSidebarHidden);
    });

    it('`onLogout` calls props.logout', () => {
      const wrapper = shallow(<LandingPage {...props} />);
      
      wrapper.instance().onLogout();
      expect(props.logout).toHaveBeenCalled();
    })
  });
});