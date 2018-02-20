import React from 'react';
import { shallow } from 'enzyme';
import TenureAgreementList from '../TenureAgreementList';
import { getMockTenureAgreements } from './mockValues';

const props = {};
const setupProps = () => {
  props.tenureAgreements = getMockTenureAgreements(3); 
};

beforeEach(() => {
  setupProps();
});

describe('TenureAgreementList', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<TenureAgreementList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders `TenureAgreementListItem` components correctly', () => {
    const wrapper = shallow(<TenureAgreementList {...props} />);
    const numberOfAgreements = props.tenureAgreements.length;
    expect(wrapper.find('TenureAgreementListItem').length).toEqual(numberOfAgreements);    
  });

  describe('Event handlers', () => {
    it('`handleActiveRow` set `activeIndex` state correctly', () => {
      const wrapper = shallow(<TenureAgreementList {...props} />);
      const mockIndex = 0;
  
      wrapper.instance().handleActiveRow(mockIndex);
      expect(wrapper.state().activeIndex).toEqual(mockIndex);
  
      wrapper.instance().handleActiveRow(mockIndex);
      expect(wrapper.state().activeIndex).toEqual(-1);
    });
  });
});
