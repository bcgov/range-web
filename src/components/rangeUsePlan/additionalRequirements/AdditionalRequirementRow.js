import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { handleNullValue } from '../../../utils';

class AdditionalRequirementRow extends Component {
  static propTypes = {
    additionalRequirement: PropTypes.shape({}).isRequired,
  }

  render() {
    const { additionalRequirement } = this.props;
    const { detail, url, category } = additionalRequirement;
    const categoryName = category && category.name;

    return (
      <div className="rup__additional-requirement__row">
        <div>
          {handleNullValue(categoryName)}
        </div>
        <div>
          {handleNullValue(detail)}
          <div className="rup__additional-requirement__url">
            <span className="rup__additional-requirement__url__label">
              Url:
            </span>
            {handleNullValue(url)}
          </div>
        </div>
      </div>
    );
  }
}

export default AdditionalRequirementRow;
