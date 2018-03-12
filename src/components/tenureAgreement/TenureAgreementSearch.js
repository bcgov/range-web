import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'semantic-ui-react';

const propTypes = {
  handleSearchInput: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
}

class TenureAgreementSearch extends Component {
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
    const { placeholder } = this.props;

    return (
      <div className="tenure-agreement-search">
        <Input
          fluid
          icon
          loading={false} 
          placeholder={placeholder}>
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
TenureAgreementSearch.propTypes = propTypes;
export default TenureAgreementSearch;