import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'semantic-ui-react';
import { ELEMENT_ID } from '../../constants/variables';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    // grab the search term from url
    this.state = {
      searchTerm: props.searchTerm,
    };
  }

  static propTypes = {
    handleSearchInput: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    searchTerm: PropTypes.string.isRequired,
    isFetchingAgreements: PropTypes.bool.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    const { searchTerm } = this.props;
    const locationChanged = nextProps.searchTerm !== searchTerm;

    // set the search term to match with the current queries when location changes
    if (locationChanged) {
      this.setState({ searchTerm: nextProps.searchTerm });
    }
  }

  handleSearchInput = (e) => {
    const { value } = e.target;
    this.setState({
      searchTerm: value,
    }, () => {
      this.props.handleSearchInput(value);
    });
  }

  render() {
    const { searchTerm } = this.state;
    const { placeholder, isFetchingAgreements } = this.props;
    return (
      <div className="agrm__search">
        <Input
          fluid
          icon
          loading={isFetchingAgreements}
          iconPosition="left"
          placeholder={placeholder}
        >
          <input
            id={ELEMENT_ID.SEARCH_TERM}
            value={searchTerm}
            onChange={this.handleSearchInput}
          />
          <Icon name="search" />
        </Input>
      </div>
    );
  }
}

export default SearchBar;
