import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../App';

const props = {};
const setupProps = () => {
  props.getReferences = jest.fn();
  props.logout = jest.fn();  
};

beforeEach(() => {
  setupProps();
});

describe('App', () => {
  xit('renders properly', () => {
    const app = shallow(<App />);
    expect(app).toMatchSnapshot();
  });
});