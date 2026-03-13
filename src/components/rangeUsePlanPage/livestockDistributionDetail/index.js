import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'react-scroll';
import { InfoTip } from '../../common';
import { PLAN } from '../../../constants/fields';
import * as strings from '../../../constants/strings';
import PermissionsField from '../../common/PermissionsField';
import { TextArea } from 'formik-semantic-ui';

const LivestockDistributionDetail = ({ livestockDistributionDetail }) => {
  return (
    <Element name="livestockDistributionDetail" id="livestockDistributionDetail">
      <div className="rup__livestock-distribution-detail">
        <div className="rup__popup-header">
          <div className="rup__content-title">{strings.LIVESTOCK_DISTRIBUTION_DETAIL}</div>
          <InfoTip header={strings.LIVESTOCK_DISTRIBUTION_DETAIL} content={strings.LIVESTOCK_DISTRIBUTION_DETAIL_TIP} />
        </div>
        <div className="rup__divider" />
        <div style={{ marginTop: 10, marginBottom: 15 }}>
          <PermissionsField
            permission={PLAN.LIVESTOCK_DISTRIBUTION_DETAIL}
            name="livestockDistributionDetail"
            component={TextArea}
            inputProps={{
              placeholder: 'Describe how grazing will occur within each pasture based on the schedule.',
              rows: 4,
            }}
            displayValue={livestockDistributionDetail}
            notProvided="Not Available"
            displayClassName="rup__section-not-found"
            fast
          />
        </div>
      </div>
    </Element>
  );
};

LivestockDistributionDetail.propTypes = {
  livestockDistributionDetail: PropTypes.string,
};

export default LivestockDistributionDetail;
