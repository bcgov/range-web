import React from 'react';
import { shallow } from 'enzyme';
import { TenureAgreementList } from '../TenureAgreementList';
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
    expect(wrapper.find('withRouter(TenureAgreementListItem)').length).toEqual(numberOfAgreements);    
  });
});
