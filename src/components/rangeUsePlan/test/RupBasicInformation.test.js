import React from 'react';
import { shallow } from 'enzyme';
import RupBasicInformation from '../view/RupBasicInformation';
import { getMockRangeUsePlan } from '../../agreement/test/mockValues';

const props = {};
const setupProps = () => {
  props.user = {};
  props.agreement = getMockRangeUsePlan(2);
  props.plan = getMockRangeUsePlan(2);
  props.zone = {};
  props.className = 'class';
  props.onZoneClicked = jest.fn();
};

beforeEach(() => {
  setupProps();
});

describe('RupBasicInformation', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<RupBasicInformation {...props} />);
  });

  describe('Event handlers', () => {

  });
});
