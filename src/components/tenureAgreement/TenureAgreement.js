import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { Button, Modal, Header } from 'semantic-ui-react';

import TenureAgreementList from './TenureAgreementList';
import TenureAgreementSearch from './TenureAgreementSearch';

import { getMockTenureAgreements } from './test/mockValues';

const propTypes = {
  tenureAgreements: PropTypes.array.isRequired,
  searchTenureAgreements: PropTypes.func.isRequired,
};

const defaultProps = {
  tenureAgreements: getMockTenureAgreements(7),
  searchTenureAgreements: (term) => {
    console.log(term);
  },
};

export class TenureAgreement extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    // wait for 1 second for the user to finish writing a search term
    // then make a network call
    this.searchTenureAgreements = debounce(props.searchTenureAgreements, 1000);
  }  
  
  handleSearchInput = (searchTerm) => {
    this.searchTenureAgreements(searchTerm)
  }
  
  render() {
    const { tenureAgreements } = this.props;

    return (
      <div className="tenure-agreement">
        <Header as='h1'>Range Use Plans</Header>

        <div className="tenure-agreement__actions">
          <div className="tenure-agreement__assign">
            <Modal trigger={<Button primary>Assign Staffs</Button>}>
              <Modal.Header>Select Assignee</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>Assign an officer to a tenure</Header>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          </div>

          <div className="tenure-agreement__search">
            <TenureAgreementSearch
              label="Search Agreements:"
              placeholder="Enter Search Terms..." 
              handleSearchInput={this.handleSearchInput}
            />
          </div>
        </div>

        <TenureAgreementList 
          tenureAgreements={tenureAgreements}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {

  }; 
};

TenureAgreement.propTypes = propTypes;
TenureAgreement.defaultProps = defaultProps;

export default connect(
  mapStateToProps, null
)(TenureAgreement);