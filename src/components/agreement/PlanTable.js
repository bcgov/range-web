import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';
import { REFERENCE_KEY } from '../../constants/variables';
import { formatDateFromServer, isStatusAmongApprovedStatuses } from '../../utils';
import { Status } from '../common';
import { EFFECTIVE_DATE, SUBMITTED, TYPE, STATUS, VIEW } from '../../constants/strings';
import { RANGE_USE_PLAN } from '../../constants/routes';

const propTypes = {
  agreement: PropTypes.shape({ plans: PropTypes.array }).isRequired,
  agreementsMapWithAllPlan: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
};

class PlanTable extends Component {
  state = {
    redirectTo: null,
  }

  onViewClicked = plan => () => {
    const { agreement } = this.props;
    this.setState({
      redirectTo: {
        push: true, // redirecting will push a new entry onto the history
        to: `${RANGE_USE_PLAN}/${agreement.id}/${plan.id}`,
      },
    });
  }

  renderPlanTableItem = (plan = {}) => {
    const { references, user } = this.props;
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const amendmentType = amendmentTypes.find(at => at.id === plan.amendmentTypeId);
    const amendment = amendmentType ? amendmentType.description : 'Initial Plan';
    const effectiveAt = formatDateFromServer(plan.effectiveAt, true, '-');
    const submittedAt = formatDateFromServer(plan.submittedAt, true, '-');
    const { id, recentApproved } = plan;

    return (
      <div key={id} className="agrm__ptable__row">
        <div className="agrm__ptable__row__cell">
          {recentApproved
            ? <Icon name="star" size="small" style={{ marginRight: '5px' }} />
            : ''
          }
          {effectiveAt}
        </div>
        <div className="agrm__ptable__row__cell">
          {submittedAt}
        </div>
        <div className="agrm__ptable__row__cell">
          {amendment}
        </div>
        <div className="agrm__ptable__row__cell">
          <Status user={user} status={plan.status} />
        </div>
        <div className="agrm__ptable__row__cell">
          <Button onClick={this.onViewClicked(plan)}>{VIEW}</Button>
        </div>
      </div>
    );
  }

  renderPlanTableItems = (plans = []) => {
    let approvedFound = false;
    return plans.map((p) => {
      const plan = { ...p };

      if (!approvedFound && isStatusAmongApprovedStatuses(plan.status)) {
        approvedFound = true;
        plan.recentApproved = true;
      }
      return this.renderPlanTableItem(plan);
    });
  }

  render() {
    const { redirectTo } = this.state;
    const { agreementsMapWithAllPlan, agreement } = this.props;
    const { plans } = agreementsMapWithAllPlan[agreement.id] || {};

    if (redirectTo) {
      return <Redirect {...redirectTo} />;
    }
    return (
      <div className="agrm__ptable">
        <div className="agrm__ptable__header-row">
          <div className="agrm__ptable__header-row__cell">{EFFECTIVE_DATE}</div>
          <div className="agrm__ptable__header-row__cell">{SUBMITTED}</div>
          <div className="agrm__ptable__header-row__cell">{TYPE}</div>
          <div className="agrm__ptable__header-row__cell">{STATUS}</div>
          <div className="agrm__ptable__header-row__cell">
            <Button disabled>{VIEW}</Button>
          </div>
        </div>
        {this.renderPlanTableItems(plans)}
      </div>
    );
  }
}

PlanTable.propTypes = propTypes;
export default PlanTable;
