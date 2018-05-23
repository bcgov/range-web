import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/authActions';
import { RANGE_USE_PLANS } from '../../constants/routes';
import { COW_PIC_SRC } from '../../constants/variables';

const propTypes = {
  logout: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export class Logout extends Component {
  componentDidMount() {
    this.props.logout();

    this.timer = setTimeout(() => {
      this.props.history.push(RANGE_USE_PLANS);
    }, 10000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <div className="logout">
        <div className="logout__container">
          <img
            className="logout__image"
            src={COW_PIC_SRC}
            alt="cow-img"
          />
          <div className="logout__title">Good bye!</div>
          <div className="logout__content">
            <p>You are successfully signed out!</p>
            <p>You will be redirected to the My Range Application home page within 10 seconds.</p>
          </div>
          <div className="logout__link">
            <Link to={RANGE_USE_PLANS}>
              Go to home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

Logout.propTypes = propTypes;
export default connect(null, { logout })(Logout);
