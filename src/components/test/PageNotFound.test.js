import React from 'react';
import { shallow } from 'enzyme';
import PageNotFound from '../PageNotFound';

const props = {};
const setupProps = () => {
  props.history = {
    push: jest.fn()
  };
};

beforeEach(() => {
  setupProps();
});


describe('LandingPage', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<PageNotFound {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Life cycles', () => {
    it('componentDidMount calls the right functions', () => {
      jest.useFakeTimers()
      const wrapper = shallow(<PageNotFound {...props} />);
      expect(props.history.push).not.toBeCalled();

      jest.runAllTimers();
      expect(props.history.push).toHaveBeenCalledTimes(1)
    });
  });
});
