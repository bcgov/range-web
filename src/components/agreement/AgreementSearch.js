import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'semantic-ui-react';
import { ELEMENT_ID } from '../../constants/variables';

const propTypes = {
  handleSearchInput: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

class AgreementSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: props.searchTerm,
    };
  }

  handleInput = (e) => {
    const { id, value } = e.target;
    this.setState({
      [id]: value,
    }, () => {
      this.props.handleSearchInput(value);
    });
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
          iconPosition="left"
          placeholder={placeholder}
        >
          <input
            id={ELEMENT_ID.SEARCH_TERM}
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
