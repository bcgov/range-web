import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const propTypes = {
  tenureAgreement: PropTypes.object.isRequired,
  onViewClicked: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
};

const defaultProps = {
  tenureAgreement: {},
};

class TenureAgreementListItem extends Component {

  onViewClicked = (e) => {
    e.preventDefault();

    const { index, onViewClicked } = this.props;
    onViewClicked(index)
  }

  render() {
    const { tenureAgreement, isActive } = this.props;
    const getClassName = (className = '') => (
      `tenure-agreement-list-item${className}`
    );

    return (
      <li className="tenure-agreement-list-item">
        <div 
          className={getClassName("__content")}
          onClick={this.onViewClicked}  
        >
          <div className={getClassName("__content__left")}>
            <div className={getClassName("__content__number")}>
              {`RAN ${tenureAgreement.number}`}
            </div>

            <div className={getClassName("__content__divider")}/>
            <div className={getClassName("__content__info")}>
              {tenureAgreement.tenureHolder.name}
            </div>
          </div>

          <div className={getClassName("__content__right")}>
            <Button 
              primary
              onClick={this.onViewClicked}
            >
              View
            </Button>
          </div>
        </div>

        <div 
          className={getClassName("__collapse ") + (isActive ? getClassName("__collapse--active") : "")}
        >
          hello bottom!
        </div>
      </li>
    );
  }
}

TenureAgreementListItem.propTypes = propTypes;
TenureAgreementListItem.defaultProps = defaultProps;
export default TenureAgreementListItem;