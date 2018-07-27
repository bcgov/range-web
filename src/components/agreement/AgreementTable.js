import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Pagination, Icon } from 'semantic-ui-react';
import AgreementTableItem from './AgreementTableItem';
import * as strings from '../../constants/strings';
import * as selectors from '../../reducers/rootReducer';
import { fetchAgreement } from '../../actionCreators';

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
  fetchAgreement: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired,
  handleActiveIndexChange: PropTypes.func.isRequired,
};
const defaultProps = {
  errorGettingAgreements: null,
};

export class AgreementTable extends Component {
  onRowClicked = (index) => {
    // const { activeIndex, fetchAgreement, handleActiveIndexChange } = this.props;

    // if (activeIndex !== index) {
    //   fetchAgreement(agreementId);
    // }

    this.props.handleActiveIndexChange(index);

    // TODO: need to go away eventually
    // this.props.history.push(`${RANGE_USE_PLAN}/${agreementId}/${planId}`);
  }

  handlePaginationChange = (e, { activePage: currentPage }) => {
    this.props.handlePaginationChange(currentPage);
  }

  renderNewAgreements = (agreements, errorGettingAgreements, isFetchingAgreements) => {
    if (errorGettingAgreements) {
      return (
        <div className="agreement__table__accordian">
          <div className="agreement__message agreement__message--error">
            {strings.ERROR_OCCUR}
          </div>
        </div>
      );
    }

    if (!isFetchingAgreements && agreements.length === 0) {
      return (
        <div className="agreement__table__accordian">
          <div className="agreement__message">
            {strings.ERROR_OCCUR}
          </div>
        </div>
      );
    }

    return agreements.map(this.renderNewAgreementTableItem);
  }

  renderNewAgreementTableItem = (agreement, index) => {
    const { user, activeIndex, fetchAgreement } = this.props;

    return (
      <AgreementTableItem
        user={user}
        key={index}
        index={index}
        activeIndex={activeIndex}
        agreement={agreement}
        fetchAgreement={fetchAgreement}
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
    const { currentPage, totalPages } = agreementPagination || {};

    return (
      <Form loading={isFetchingAgreements}>
        <div className="agreement__table">
          <div className="agreement__table__header-row">
            <div className="agreement__table__header-row__cell">{strings.RANGE_NUMBER}</div>
            <div className="agreement__table__header-row__cell">{strings.RANGE_NAME}</div>
            <div className="agreement__table__header-row__cell">{strings.AGREEMENT_HOLDER}</div>
            <div className="agreement__table__header-row__cell">{strings.STAFF_CONTACT}</div>
            <div className="agreement__table__header-row__cell">{strings.STATUS}</div>
            <div className="agreement__table__header-row__cell">
              <Icon name="plus circle" />
            </div>
          </div>

          {this.renderNewAgreements(agreements, errorGettingAgreements, isFetchingAgreements)}
        </div>

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
export default connect(mapStateToProps, { fetchAgreement })(AgreementTable);
