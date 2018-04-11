import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { RANGE_USE_PLANS } from '../constants/routes';
import { COW_PIC_SRC } from '../constants/variables';

const propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

class PageNotFound extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.history.push(RANGE_USE_PLANS);
    }, 10000);
  }

  render() {
    return (
      <div className="page-not-found">
        <div className="page-not-found__container">
          <img
            className="page-not-found__image"
            src={COW_PIC_SRC}
            alt="cow-img"
          />
          <div className="page-not-found__title">Page Not Found</div>
          <div className="page-not-found__content">
            <p>This is not the web page you are looking for.</p>
            <p>You will be redirected to the My Range Application home page within 10 seconds.</p>
          </div>
          <div className="page-not-found__link">
            <Link to={RANGE_USE_PLANS}>
              Go to home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

PageNotFound.propTypes = propTypes;
export default PageNotFound;
