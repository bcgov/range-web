import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Form as Loading, Pagination, Icon } from 'semantic-ui-react';
import AgreementTableItem from './AgreementTableItem';
import { RANGE_NUMBER, AGREEMENT_HOLDER, STAFF_CONTACT, RANGE_NAME, STATUS } from '../../constants/strings';

const propTypes = {
  agreementsState: PropTypes.shape({
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  handlePaginationChange: PropTypes.func.isRequired,
};

export class AgreementTable extends Component {
  state = {
    activeIndex: 0,
  }

  onRowClicked = (index, agrementId, planId) => {
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  handlePaginationChange = (e, { activePage: currentPage }) => {
    this.props.handlePaginationChange(currentPage);
  }

  renderAgreementTableItem = (agreement, index) => {
    const { activeIndex } = this.state;
    const isActive = activeIndex === index;

    return (
      <AgreementTableItem
        key={index}
        index={index}
        isActive={isActive}
        agreement={agreement}
        onRowClicked={this.onRowClicked}
      />
    );
  }

  render() {
    const {
      data: agreements,
      isLoading,
      currentPage,
      totalPages,
    } = this.props.agreementsState;

    return (
      <Loading loading={isLoading}>
        <Table selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{RANGE_NUMBER}</Table.HeaderCell>
              <Table.HeaderCell>{RANGE_NAME}</Table.HeaderCell>
              <Table.HeaderCell>{AGREEMENT_HOLDER}</Table.HeaderCell>
              <Table.HeaderCell>{STAFF_CONTACT}</Table.HeaderCell>
              <Table.HeaderCell>{STATUS}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {agreements && agreements.map(this.renderAgreementTableItem)}
          </Table.Body>
        </Table>
        <div className="agreement__pagination">
          <Pagination
            size="mini"
            siblingRange="2"
            activePage={currentPage}
            onPageChange={this.handlePaginationChange}
            totalPages={totalPages}
            ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
            firstItem={{ content: <Icon name="angle double left" />, icon: true }}
            lastItem={{ content: <Icon name="angle double right" />, icon: true }}
            prevItem={{ content: <Icon name="angle left" />, icon: true }}
            nextItem={{ content: <Icon name="angle right" />, icon: true }}
          />
        </div>
      </Loading>
    );
  }
}

AgreementTable.propTypes = propTypes;
export default AgreementTable;
