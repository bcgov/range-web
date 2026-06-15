import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { formatDateFromServer, canUserEditThisPlan, isPlanAmendment } from '../../utils';
import { useUser } from '../../providers/UserProvider';
import { useReferences } from '../../providers/ReferencesProvider';
import { CircularProgress } from '@mui/material';
import { MuiIcon, Status, PrimaryButton } from '../common';
import { REFERENCE_KEY } from '../../constants/variables';
import { INITIAL_PLAN, VIEW } from '../../constants/strings';
import { RANGE_USE_PLAN } from '../../constants/routes';

interface PlanTableRowProps {
  plan: any;
}

function PlanTableRow({ plan }: PlanTableRowProps) {
  const user = useUser()!;
  const references: any = useReferences();
  const { page } = useParams<{ page?: string }>();
  const location = useLocation();

  const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
  if (!amendmentTypes) return <CircularProgress size={24} />;
  const amendmentType = amendmentTypes.find((at: any) => at.id === plan.amendmentTypeId);
  const amendment = amendmentType ? amendmentType.description : INITIAL_PLAN;
  const effectiveAt = formatDateFromServer(plan.effectiveAt, true, '-');
  const submittedAt = formatDateFromServer(plan.submittedAt, true, '-');
  const { recentApproved } = plan;

  return (
    <div className="agrm__ptable__row">
      <div className="agrm__ptable__row__cell">
        {recentApproved && <MuiIcon name="star" size="small" style={{ marginRight: '7px' }} />}
        {effectiveAt}
      </div>
      <div className="agrm__ptable__row__cell">{submittedAt}</div>
      <div className="agrm__ptable__row__cell">{amendment}</div>
      <div className="agrm__ptable__row__cell">
        <Status user={user} status={plan.status} isAmendment={isPlanAmendment(plan)} />
      </div>
      <div className="agrm__ptable__row__cell">
        <PrimaryButton
          inverted
          compact
          as={Link}
          to={{
            pathname: `${RANGE_USE_PLAN}/${plan.id}`,
            state: { page, prevSearch: location.search },
          }}
        >
          {canUserEditThisPlan(plan, user) ? 'Edit' : VIEW}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default PlanTableRow;
