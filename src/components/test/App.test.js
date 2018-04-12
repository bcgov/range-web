import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../App';
import * as Authentication from '../../handlers/authentication';

const props = {};
const setupProps = () => {
  props.getReferences = jest.fn();
  props.logout = jest.fn();
  props.user = {};
};

beforeEach(() => {
  setupProps();
});

Authentication.registerAxiosInterceptors = jest.fn();

describe('App', () => {
  xit('renders properly', () => {
    const wrapper = shallow(<App />);
    expect(wrapper).toMatchSnapshot();
  });

  it('`componentWillMount` calls the right function', () => {
    const wrapper = shallow(<App {...props} />);
    expect(Authentication.registerAxiosInterceptors).toHaveBeenCalledWith(props.logout);
  });
});
