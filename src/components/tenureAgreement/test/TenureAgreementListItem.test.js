import React from 'react';
import { shallow } from 'enzyme';
import TenureAgreementListItem from '../TenureAgreementListItem';
import { getTenureAgreement } from './mockValues';

const props = {};
const setupProps = () => {
  props.tenureAgreement = getTenureAgreement(1);
  props.onViewClicked = jest.fn();
  props.index = 1;
  props.isActive = false;
};

beforeEach(() => {
  setupProps();
});

describe('TenureAgreementListItem', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<TenureAgreementListItem {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('bottom section becomes active when clicking on View button', () => {
    const wrapper = shallow(<TenureAgreementListItem {...props} />);
    const collapseActiveClass = '.tenure-agreement-list-item__collapse--active';

    expect(wrapper.find(collapseActiveClass).exists()).toBe(false);    
    
    wrapper.find('Button').simulate('click', { preventDefault: jest.fn() });
    wrapper.setProps({ isActive: true });
    expect(props.onViewClicked).toHaveBeenCalledWith(props.index);
    expect(wrapper.find(collapseActiveClass).exists()).toBe(true);    
  });

  describe('Event handlers', () => {
    it('`onViewClicked` calls props.onViewClicked', () => {
      const wrapper = shallow(<TenureAgreementListItem {...props} />);
      
      wrapper.instance().onViewClicked({ preventDefault: jest.fn() });
      expect(props.onViewClicked).toHaveBeenCalledWith(props.index);
    });
  });
});