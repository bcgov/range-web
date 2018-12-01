import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NOT_PROVIDED } from '../../../constants/strings';
import ManagementConsiderationRow from './ManagementConsiderationRow';

class PlantCommunityActionsBox extends Component {
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
      <div className="rup__section-not-found">{NOT_PROVIDED}</div>
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
      <div className="rup__management-considerations">
        <div className="rup__content-title">Management Considerations</div>
        <div className="rup__divider" />
        <div className="rup__management-considerations__note">
          This content is not part of the legal Range Use Plan and is available for information purposes
        </div>
        <div className="rup__management-considerations__box">
          <div className="rup__additional-requirement__header">
            <div>Considerations</div>
            <div>Details</div>
          </div>
          {this.renderManagementConsiderations(managementConsiderations)}
        </div>
      </div>
    );
  }
}

export default PlantCommunityActionsBox;
