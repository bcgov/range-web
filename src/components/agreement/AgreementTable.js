import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Form as Loading, Pagination, Icon } from 'semantic-ui-react';
import AgreementTableItem from './AgreementTableItem';
import { RANGE_NUMBER, AGREEMENT_HOLDER, STAFF_CONTACT, RANGE_NAME, STATUS } from '../../constants/strings';
import { getAgreements, getAgreementsIsFetching, getAgreementsPagination, getUser, getAgreementsErrorMessage } from '../../reducers/rootReducer';

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
  history: PropTypes.shape({}).isRequired,
};
const defaultProps = {
  errorGettingAgreements: null,
};

export class AgreementTable extends Component {
  state = {
    activeIndex: 0,
  }

  onRowClicked = (index) => {
    const newIndex = this.state.activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  handlePaginationChange = (e, { activePage: currentPage }) => {
    this.props.handlePaginationChange(currentPage);
  }

  renderAgreementTableItem = (agreement, index) => {
    const isActive = this.state.activeIndex === index;
    const { user, history } = this.props;

    return (
      <AgreementTableItem
        user={user}
        history={history}
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
      agreements,
      isFetchingAgreements,
      agreementPagination,
      errorGettingAgreements,
    } = this.props;
    const { currentPage, totalPages } = agreementPagination;

    return (
      <Loading loading={isFetchingAgreements}>
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
            { errorGettingAgreements &&
              <Table.Row>
                <Table.Cell colSpan="5">
                  <div className="agreement__error">
                    Error Occured!
                  </div>
                </Table.Cell>
              </Table.Row>
            }
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
const mapStateToProps = state => (
  {
    agreements: getAgreements(state),
    isFetchingAgreements: getAgreementsIsFetching(state),
    agreementPagination: getAgreementsPagination(state),
    errorGettingAgreements: getAgreementsErrorMessage(state),
    user: getUser(state),
  }
);
AgreementTable.propTypes = propTypes;
AgreementTable.defaultProps = defaultProps;
export default connect(mapStateToProps, null)(AgreementTable);
