import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ManagementConsiderationRow from './ManagementConsiderationRow';

class ManagementConsiderations extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    managementConsiderationsMap: PropTypes.shape({}).isRequired,
  }

  renderAdditionalRequirement = (managementConsideration) => {
    return (
      <ManagementConsiderationRow
        key={managementConsideration.id}
        managementConsideration={managementConsideration}
      />
    );
  }

  renderManagementConsiderations = (managementConsiderations = []) => {
    const isEmpty = managementConsiderations.length === 0;

    return isEmpty ? (
      <div className="rup__m-considerations__no-content">No management considerations provided</div>
    ) : (
      managementConsiderations.map(this.renderAdditionalRequirement)
    );
  }

  render() {
    const { plan, managementConsiderationsMap } = this.props;
    const managementConsiderationIds = plan && plan.managementConsiderations;
    const managementConsiderations = managementConsiderationIds &&
      managementConsiderationIds.map(id => managementConsiderationsMap[id]);

    return (
      <div className="rup__m-considerations">
        <div className="rup__content-title">Management Considerations</div>
        <div className="rup__divider" />
        <div className="rup__m-considerations__note">
          Content in this section is non-legal and is intended to provide additional information about management within the agreement area.
        </div>
        <div className="rup__m-considerations__box">
          <div className="rup__m-consideration__header">
            <div>Considerations</div>
            <div>Details</div>
          </div>
          {this.renderManagementConsiderations(managementConsiderations)}
        </div>
      </div>
    );
  }
}

export default ManagementConsiderations;
