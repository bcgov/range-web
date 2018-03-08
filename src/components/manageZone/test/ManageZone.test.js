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
  it('renders correctly', () => {
    const wrapper = shallow(<ManageZone {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});