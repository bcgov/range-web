import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Form, Pagination, Icon } from 'semantic-ui-react';
import AgreementTableItem from './AgreementTableItem';
import * as strings from '../../constants/strings';
import * as selectors from '../../reducers/rootReducer';
import { RANGE_USE_PLAN } from '../../constants/routes';

const propTypes = {
  agreements: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetchingAgreements: PropTypes.bool.isRequired,
  agreementPagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  errorGettingAgreements: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  user: PropTypes.shape({}).isRequired,
  handlePaginationChange: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  references: PropTypes.shape({}).isRequired,
};
const defaultProps = {
  errorGettingAgreements: null,
};

export class AgreementTable extends Component {
  state = {
    activeIndex: 0,
  }

  onRowClicked = (index, agreementId, planId) => {
    const newIndex = this.state.activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });

    // TODO: need to go away eventually
    this.props.history.push(`${RANGE_USE_PLAN}/${agreementId}/${planId}`);
  }

  handlePaginationChange = (e, { activePage: currentPage }) => {
    this.props.handlePaginationChange(currentPage);
  }

  renderAgreementTableItem = (agreement, index) => {
    const isActive = this.state.activeIndex === index;
    const { user, references } = this.props;

    return (
      <AgreementTableItem
        user={user}
        key={index}
        index={index}
        isActive={isActive}
        agreement={agreement}
        references={references}
        onRowClicked={this.onRowClicked}
      />
    );
  }

  renderAgreements = (agreements, errorGettingAgreements, isFetchingAgreements) => {
    if (errorGettingAgreements) {
      return (
        <Table.Row>
          <Table.Cell colSpan="5">
            <div className="agreement__error">
              {strings.ERROR_OCCUR}
            </div>
          </Table.Cell>
        </Table.Row>
      );
    }

    if (!isFetchingAgreements && agreements.length === 0) {
      return (
        <Table.Row>
          <Table.Cell colSpan="5">
            <div className="agreement__empty">
              {strings.NO_RESULTS_FOUND}
            </div>
          </Table.Cell>
        </Table.Row>
      );
    }

    return agreements.map(this.renderAgreementTableItem);
  }

  render() {
    const {
      agreements,
      isFetchingAgreements,
      agreementPagination,
      errorGettingAgreements,
    } = this.props;
    const { currentPage, totalPages } = agreementPagination || {};

    return (
      <Form loading={isFetchingAgreements}>
        <Table selectable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{strings.RANGE_NUMBER}</Table.HeaderCell>
              <Table.HeaderCell>{strings.RANGE_NAME}</Table.HeaderCell>
              <Table.HeaderCell>{strings.AGREEMENT_HOLDER}</Table.HeaderCell>
              <Table.HeaderCell>{strings.STAFF_CONTACT}</Table.HeaderCell>
              <Table.HeaderCell>{strings.STATUS}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.renderAgreements(agreements, errorGettingAgreements, isFetchingAgreements)}
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
      </Form>
    );
  }
}

const mapStateToProps = state => (
  {
    agreements: selectors.getAgreements(state),
    isFetchingAgreements: selectors.getIsFetchingAgreements(state),
    agreementPagination: selectors.getAgreementsPagination(state),
    errorGettingAgreements: selectors.getAgreementsErrorMessage(state),
    user: selectors.getUser(state),
    references: selectors.getReferences(state),
  }
);

AgreementTable.propTypes = propTypes;
AgreementTable.defaultProps = defaultProps;
export default connect(mapStateToProps, null)(AgreementTable);
