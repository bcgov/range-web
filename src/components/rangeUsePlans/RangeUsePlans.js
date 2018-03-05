import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { Button, Modal, Header, Pagination, Icon } from 'semantic-ui-react';

import RangeUsePlansTable from './RangeUsePlansTable';
import RangeUsePlansSearch from './RangeUsePlansSearch';

const propTypes = {
  rangeUsePlanState: PropTypes.object.isRequired,
  searchRangeUsePlans: PropTypes.func.isRequired,
};

export class RangeUsePlans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
    }
    // wait for 1 second for the user to finish writing a search term
    // then make a network call
    this.searchRangeUsePlans = debounce(props.searchRangeUsePlans, 1000);
  }  
  
  handleSearchInput = (searchTerm) => {
    this.searchRangeUsePlans(searchTerm)
  }

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })
  
  render() {
    const { rangeUsePlans, isLoading, success, totalPages, currentPage } = this.props.rangeUsePlanState;
    const { activePage } = this.state;

    return (
      <div className="range-use-plans">
        <div className="range-use-plans__header">
          <Header as='h1'>Range Use Plans</Header>
        
          <div className="range-use-plans__actions">
            <div className="range-use-plans__assign">
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

            <div className="range-use-plans__search">
              <RangeUsePlansSearch
                label="Search Agreements:"
                placeholder="Enter Search Terms..." 
                handleSearchInput={this.handleSearchInput}
              />
            </div>
          </div>
        </div>

        <div className="range-use-plans__table">
          <RangeUsePlansTable
            isLoading={isLoading}
            rangeUsePlans={rangeUsePlans}
          />
        </div>

        <div className="range-use-plans__pagination">
          <Pagination 
            size='mini' 
            activePage={activePage}
            onPageChange={this.handlePaginationChange} totalPages={totalPages}
            ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
            prevItem={{ content: <Icon name='angle left' />, icon: true }}
            nextItem={{ content: <Icon name='angle right' />, icon: true }}
          />
        </div>
      </div>
    );
  }
}

RangeUsePlans.propTypes = propTypes;
export default RangeUsePlans;