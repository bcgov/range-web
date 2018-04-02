import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'semantic-ui-react';

const propTypes = {
  handleSearchInput: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
}

class AgreementSearch extends Component {
  state = {
    searchTerm: '',
  }
  
  handleInput = (e) => {
    const { id, value } = e.target;
    
    this.setState({
      [id]: value
    }, () => {
      this.props.handleSearchInput(value);
    });
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.searchTerm !== this.props.searchTerm) {
      this.setState({ searchTerm: nextProps.searchTerm });
    }
  }

  render() {
    const { searchTerm } = this.state;
    const { placeholder } = this.props;
    return (
      <div className="agreement__search">
        <Input
          fluid
          icon
          loading={false} 
          placeholder={placeholder}>
          <input 
            id="searchTerm"
            value={searchTerm}
            onChange={this.handleInput}
          />
          <Icon name="search" />
        </Input>
      </div>
    );
  }
}
AgreementSearch.propTypes = propTypes;
export default AgreementSearch;