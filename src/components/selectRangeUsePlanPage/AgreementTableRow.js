import React from 'react';
import classnames from 'classnames';
import {
  handleNullValue,
  getUserFullName,
  getAgreementHolders,
  getClientFullName,
} from '../../utils';
import { useUser } from '../../providers/UserProvider';
import { Status } from '../common';
import { Icon } from 'semantic-ui-react';
import PlanTable from './PlanTable';
import NewPlanButton from './NewPlanButton';
import { canUserEdit } from '../common/PermissionsField';
import { PLAN } from '../../constants/fields';

const AgreementTableRow = ({ agreement, active, onSelect, noneSelected }) => {
  const [plan] = agreement.plans;

  const user = useUser();

  const { zone, clients } = agreement;

  const rangeName = plan && plan.rangeName;
  const status = plan && plan.status;
  const staff = zone && zone.user;
  const staffFullName = getUserFullName(staff);
  const { primaryAgreementHolder } = getAgreementHolders(clients);
  const primaryAgreementHolderName = getClientFullName(primaryAgreementHolder);
  const isActive = active;
  const isActiveAndHasPlans = plan && isActive;

  return (
    <div
      className={classnames('agrm__table__row', {
        'agrm__table__row--active': active,
        'agrm__table__row--not-active': !noneSelected && !active,
      })}
    >
      <div className="agrm__table__accordian" onClick={plan && onSelect}>
        <div className="agrm__table__accordian__cell">{agreement.id}</div>
        <div className="agrm__table__accordian__cell">
          {handleNullValue(rangeName, false, '-')}
        </div>
        <div className="agrm__table__accordian__cell">
          {handleNullValue(primaryAgreementHolderName)}
        </div>
        <div className="agrm__table__accordian__cell">
          {handleNullValue(staffFullName)}
        </div>
        <div className="agrm__table__accordian__cell">
          {agreement.plans.length === 0 && canUserEdit(PLAN.ADD, user) ? (
            <NewPlanButton agreement={agreement} />
          ) : (
            <Status user={user} status={status} />
          )}
        </div>
        <div className="agrm__table__accordian__cell">
          {isActiveAndHasPlans && <Icon name="minus circle" size="large" />}
          {!isActiveAndHasPlans && (
            <Icon
              name="plus circle"
              size="large"
              disabled={plan === undefined}
            />
          )}
        </div>
      </div>
      <div
        className={classnames('agrm__table__panel', {
          'agrm__table__panel--active': isActiveAndHasPlans,
        })}
      >
        <PlanTable agreementId={agreement.id} />
      </div>
    </div>
  );
};

export default AgreementTableRow;
