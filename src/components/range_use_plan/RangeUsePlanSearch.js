import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'semantic-ui-react';

const propTypes = {
  handleSearchInput: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

class RangeUsePlanSearch extends Component {
  state = {
    search: '',
  }
  
  handleInput = (e) => {
    const { id, value } = e.target;
    
    this.setState({
      [id]: value
    }, () => {
      this.props.handleSearchInput(value);
    });
  }
  
  render() {
    const { search } = this.state;
    const { placeholder, label } = this.props;

    return (
      <div className="range-use-plan__search__item">
        <div className="range-use-plan__search__item__label">{label}</div>        
        
        <Input icon placeholder={placeholder}>
          <input 
            id="search"
            value={search}
            onChange={this.handleInput}
          />
          <Icon name="search" />
        </Input>
      </div>
    );
  }
}
RangeUsePlanSearch.propTypes = propTypes;
export default RangeUsePlanSearch;