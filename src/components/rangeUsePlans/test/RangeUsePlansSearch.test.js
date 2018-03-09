import React from 'react';
import { shallow } from 'enzyme';
import RangeUsePlansSearch from '../RangeUsePlansSearch';

const props = {};
const setupProps = () => {
  props.handleSearchInput = jest.fn();
  props.placeholder = "placeholder";
  props.label = "label";
};

beforeEach(() => {
  setupProps();
});

describe('RangeUsePlansSearch', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<RangeUsePlansSearch {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  
  it('set `search` state when typing terms for searching', () => {
    const wrapper = shallow(<RangeUsePlansSearch {...props} />);
    const mockTerm = "hello";

    wrapper.find('input#search').simulate('change', { target: { id: 'search', value: mockTerm }});
    expect(wrapper.state().search).toEqual(mockTerm);
    expect(props.handleSearchInput).toHaveBeenCalledWith(mockTerm);
  });

  describe('Event handlers', () => {
    it('`handleInput` set state and calls handleSearchInput', () => {
      const wrapper = shallow(<RangeUsePlansSearch {...props} />);
      const mockId = 'id';
      const mockValue = 'value';

      wrapper.instance().handleInput({ target: { id: mockId, value: mockValue }});
      expect(wrapper.state()[mockId]).toEqual(mockValue);
      expect(props.handleSearchInput).toHaveBeenCalledWith(mockValue);
    });
  });
});