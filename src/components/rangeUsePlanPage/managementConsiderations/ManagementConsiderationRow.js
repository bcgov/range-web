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
      <div className="rup__m-consideration__row">
        <div>
          {handleNullValue(considerationTypeName)}
        </div>
        <div>
          {handleNullValue(detail)}
          <div className="rup__m-consideration__url">
            <span className="rup__m-consideration__url__label">
              URL:
            </span>
            {handleNullValue(url)}
          </div>
        </div>
      </div>
    );
  }
}

export default ManagementConsiderationRow;
