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
  props.getReferences = jest.fn();
  props.getZones = jest.fn();
};

beforeEach(() => {
  setupProps();
});

describe('LandingPage', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<LandingPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Event handlers', () => {
    it('`onLogout` calls props.logout', () => {
      const wrapper = shallow(<LandingPage {...props} />);
      
      wrapper.instance().onLogout();
      expect(props.logout).toHaveBeenCalled();
    });
  });

  describe('Life cycles', () => {
    it('componentDidMount calls the right functinos', () => {
      const wrapper = shallow(<LandingPage {...props} />);
      
      expect(props.getReferences).toHaveBeenCalled();
      expect(props.getZones).toHaveBeenCalled();
    });
  });
});