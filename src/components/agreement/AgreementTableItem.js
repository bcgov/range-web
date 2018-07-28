import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import { Icon, Button, Segment } from 'semantic-ui-react';
import { Status, Loading } from '../common';
import { presentNullValue, getUserFullName, getAgreementHolders } from '../../utils';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { REFERENCE_KEY } from '../../constants/variables';
import { TYPE, STATUS } from '../../constants/strings';

const propTypes = {
  agreement: PropTypes.shape({ plans: PropTypes.array }).isRequired,
  user: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onRowClicked: PropTypes.func.isRequired,
  fetchAgreement: PropTypes.func.isRequired,
  references: PropTypes.shape({}).isRequired,
};

export class AgreementTableItem extends Component {
  state = {
    wholePlans: [],
    isFetchingWholePlans: false,
    redirectTo: null,
  }

  onRowClicked = () => {
    const {
      agreement,
      index,
      activeIndex,
      onRowClicked,
      fetchAgreement,
    } = this.props;
    const [plan] = agreement.plans;

    if (plan && agreement) {
      onRowClicked(index);

      if (activeIndex !== index) {
        this.setState({ wholePlans: [], isFetchingWholePlans: true });
        // fetch agreements when this row becomes active
        fetchAgreement(agreement.id).then(
          (agreement) => {
            this.setState({ wholePlans: agreement.plans, isFetchingWholePlans: false });
          },
          () => {
            this.setState({ isFetchingWholePlans: false });
          },
        );
      }
    } else {
      alert('No range use plan found!');
    }
  }

  renderPlanTable = (wholePlans) => {
    const { isFetchingWholePlans } = this.state;
    return (
      <Segment basic>
        <Loading active={isFetchingWholePlans} />

        <div className="agrm__ptable">
          <div className="agrm__ptable__header-row">
            <div className="agrm__ptable__header-row__cell">{TYPE}</div>
            <div className="agrm__ptable__header-row__cell">{STATUS}</div>
            <div className="agrm__ptable__header-row__cell">
              <Button>View</Button>
            </div>
          </div>

          {wholePlans.map(this.renderPlan)}
        </div>
      </Segment>
    );
  }

  renderPlan = (plan = {}) => {
    const { references, user } = this.props;
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const amendmentType = amendmentTypes.find(at => at.id === plan.amendmentTypeId);
    const amendment = amendmentType ? amendmentType.description : 'Initial Plan';

    return (
      <div key={plan.id} className="agrm__ptable__row">
        <div className="agrm__ptable__row__cell">
          {amendment}
        </div>
        <div className="agrm__ptable__row__cell">
          <Status user={user} status={plan.status} />
        </div>
        <div className="agrm__ptable__row__cell">
          <Button onClick={this.onViewClicked(plan)}>View</Button>
        </div>
      </div>
    );
  }

  onViewClicked = plan => (e) => {
    e.preventDefault();
    const { agreement } = this.props;
    this.setState({ redirectTo: `${RANGE_USE_PLAN}/${agreement.id}/${plan.id}` });
  }

  render() {
    const { wholePlans, redirectTo } = this.state;
    const {
      agreement,
      activeIndex,
      index,
      user,
    } = this.props;
    const {
      id: agreementId,
      zone,
      clients,
      plans,
    } = agreement || {};

    const [plan] = plans;
    const rangeName = plan && plan.rangeName;
    const status = plan && plan.status;
    const staff = zone && zone.user;
    const staffFullName = getUserFullName(staff);
    const { primaryAgreementHolder } = getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;
    const isActive = activeIndex === index;

    if (redirectTo) {
      return <Redirect push to={redirectTo} />;
    }

    return (
      <div className={classnames('agrm__table__row', { 'agrm__table__row--active': isActive })}>
        <button
          className="agrm__table__accordian"
          onClick={this.onRowClicked}
        >
          <div className="agrm__table__accordian__cell">{agreementId}</div>
          <div className="agrm__table__accordian__cell">{presentNullValue(rangeName)}</div>
          <div className="agrm__table__accordian__cell">{presentNullValue(primaryAgreementHolderName)}</div>
          <div className="agrm__table__accordian__cell">{presentNullValue(staffFullName)}</div>
          <div className="agrm__table__accordian__cell">
            <Status user={user} status={status} />
          </div>
          <div className="agrm__table__accordian__cell">
            { isActive &&
              <Icon name="times circle outline" />
            }
            { !isActive &&
              <Icon name="plus circle" />
            }
          </div>
        </button>
        <div className={classnames('agrm__table__panel', { 'agrm__table__panel--active': isActive })}>
          {this.renderPlanTable(wholePlans)}
        </div>
      </div>
    );
  }
}

AgreementTableItem.propTypes = propTypes;
export default AgreementTableItem;
