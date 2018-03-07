import React from 'react';
import { shallow } from 'enzyme';
import { RangeUsePlansTable } from '../RangeUsePlansTable';
import { getMockRangeUsePlans } from './mockValues';

const props = {};
const setupProps = () => {
  props.rangeUsePlans = getMockRangeUsePlans(3);
  props.isLoading = false;
};

beforeEach(() => {
  setupProps();
});

describe('RangeUsePlansTable', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<RangeUsePlansTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders `RangeUsePlansTableItem` components correctly', () => {
    const wrapper = shallow(<RangeUsePlansTable {...props} />);
    const numberOfAgreements = props.rangeUsePlans.length;
    expect(wrapper.find('withRouter(RangeUsePlansTableItem)').length).toEqual(numberOfAgreements);    
  });
});
