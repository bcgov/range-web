import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { getAgreementSearchParams } from '../../reducers/rootReducer';
import { stringifyQuery } from '../../utils';
import { HOME } from '../../constants/routes';

const propTypes = {
  agreementSearchParams: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

class BackBtn extends Component {
  state = {
    redirect: null,
  }

  onBtnClick = (e) => {
    e.preventDefault();
    const { agreementSearchParams } = this.props;
    const query = stringifyQuery(agreementSearchParams);
    this.setState({
      redirect: query,
    });
  }

  render() {
    const { className } = this.props;
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to={`${HOME}?${redirect}`} />;
    }

    return (
      <div
        className={className}
        onClick={this.onBtnClick}
        role="button"
        tabIndex="0"
      >
        <Icon name="arrow left" size="large" />
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    agreementSearchParams: getAgreementSearchParams(state),
  }
);

BackBtn.propTypes = propTypes;
BackBtn.defaultProps = defaultProps;
export default connect(mapStateToProps, null)(BackBtn);
