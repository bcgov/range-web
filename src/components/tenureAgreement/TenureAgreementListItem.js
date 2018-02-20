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
  state = {
    isOpen: false
  }

  onViewClicked = (e) => {
    e.preventDefault();

    const { index, onViewClicked } = this.props;
    onViewClicked(index)
  }

  render() {
    const { tenureAgreement, isActive } = this.props;

    return (
      <li className="tenure-agreement-list-item">
        <div className="tenure-agreement-list-item__content">
          <div className="tenure-agreement-list-item__content__left">
            <div className="tenure-agreement-list-item__content__number">
              {`RAN ${tenureAgreement.number}`}
            </div>

            <div className="tenure-agreement-list-item__content__divider" />
            <div className="tenure-agreement-list-item__content__info">
              {tenureAgreement.tenureHolder.name}
            </div>
          </div>

          <div className="tenure-agreement-list-item__content__right">
            <Button 
              primary
              onClick={this.onViewClicked}
            >
              View
            </Button>
          </div>
        </div>

        <div 
          className={"tenure-agreement-list-item__collapse" + (isActive ? " tenure-agreement-list-item__collapse--active" : "")}
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