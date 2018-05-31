import React from 'react';
import { shallow } from 'enzyme';
import RupPastures from '../view/RupPastures';
import { getMockRangeUsePlan } from '../../agreement/test/mockValues';

const props = {};
const setupProps = () => {
  props.plan = getMockRangeUsePlan(2);
  props.className = 'class';
};

beforeEach(() => {
  setupProps();
});

describe('RupPastures', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<RupPastures {...props} />);
  });

  describe('Event handlers', () => {

  });
});
