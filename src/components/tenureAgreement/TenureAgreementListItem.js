import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TENURE_AGREEMENT } from '../../constants/routes';

const propTypes = {
  tenureAgreement: PropTypes.object.isRequired,
};

const defaultProps = {
  tenureAgreement: {},
};

class TenureAgreementListItem extends Component {

  render() {
    const { tenureAgreement } = this.props;
    const getClassName = (className = '') => (
      `tenure-agreement-list-item${className}`
    );

    return (
      <li className="tenure-agreement-list-item">
        <Link
          to={`${TENURE_AGREEMENT}/${tenureAgreement.id}`}
          className={getClassName("__content")}
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
        </Link>
      </li>
    );
  }
}

TenureAgreementListItem.propTypes = propTypes;
TenureAgreementListItem.defaultProps = defaultProps;
export default TenureAgreementListItem;