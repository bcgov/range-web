import React from 'react';
import { shallow } from 'enzyme';
import { ManageZone } from '../ManageZone';

const props = {};
const setupProps = () => {
  // props.
};

beforeEach(() => {
  setupProps();
});

describe('ManageZone', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<ManageZone {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});