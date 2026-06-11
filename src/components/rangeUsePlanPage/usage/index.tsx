import React from 'react';
import UsageTable from './UsageTable';
import { InfoTip } from '../../common';
import { USAGE, USAGE_TIP } from '../../../constants/strings';

interface UsageProps {
  plan: any;
  usage: any[];
}

const Usage = ({ usage, plan }: UsageProps) => {
  return (
    <div className="rup__usage__table">
      <div className="rup__popup-header">
        <div className="rup__content-title">{USAGE}</div>
        <InfoTip header={USAGE} content={USAGE_TIP} />
      </div>
      <div className="rup__divider" />
      <UsageTable plan={plan} usage={usage} />
    </div>
  );
};

export default Usage;
