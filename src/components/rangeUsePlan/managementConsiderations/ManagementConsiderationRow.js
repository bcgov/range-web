import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { handleNullValue } from '../../../utils';

class ManagementConsiderationRow extends Component {
  static propTypes = {
    managementConsideration: PropTypes.shape({}).isRequired,
  }

  render() {
    const { managementConsideration } = this.props;
    const { detail, url, considerationType } = managementConsideration;
    const considerationTypeName = considerationType && considerationType.name;

    return (
      <div className="rup__management-consideration__row">
        <div>
          {handleNullValue(considerationTypeName)}
        </div>
        <div>
          {handleNullValue(detail)}
          <div className="rup__management-consideration__url">
            <span className="rup__management-consideration__url__label">
              Url:
            </span>
            {handleNullValue(url)}
          </div>
        </div>
      </div>
    );
  }
}

export default ManagementConsiderationRow;