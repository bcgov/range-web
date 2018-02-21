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

  describe('Life cycles', () => {
    it('`componentWillReceiveProps` calls the right functions', () => {
      const wrapper = shallow(<LandingPage {...props} />);
      const instance = wrapper.instance();
      const closeSidebarSpy = jest.spyOn(instance, 'closeSidebar');
      const mockProps = { location: { mock: "value" } };
      instance.componentWillReceiveProps(mockProps);

      expect(wrapper.state().isSidebarHidden).toEqual(true);
      expect(closeSidebarSpy).toHaveBeenCalled();
    });
  });

  describe('Event handlers', () => {
    it('`toggleSidebar` sets `isSidebarHidden` state correctly', () => {
      const wrapper = shallow(<LandingPage {...props} />);
      const prevIsSidebarHidden = wrapper.state().isSidebarHidden;

      wrapper.instance().toggleSidebar();
      expect(wrapper.state().isSidebarHidden).toEqual(!prevIsSidebarHidden);
    });

    it('`closeSidebar` sets `isSidebarHidden` state correctly', () => {
      const wrapper = shallow(<LandingPage {...props} />);

      wrapper.instance().closeSidebar();
      expect(wrapper.state().isSidebarHidden).toEqual(true);
    });

    it('`onLogout` calls props.logout', () => {
      const wrapper = shallow(<LandingPage {...props} />);
      
      wrapper.instance().onLogout();
      expect(props.logout).toHaveBeenCalled();
    });
  });
});