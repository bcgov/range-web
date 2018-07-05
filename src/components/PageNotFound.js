import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { HOME } from '../constants/routes';
import { IMAGE_SRC } from '../constants/variables';

const propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

class PageNotFound extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.props.history.push(HOME);
    }, 10000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <section className="page-not-found">
        <div className="page-not-found__container">
          <img
            className="page-not-found__image"
            src={IMAGE_SRC.COW_PIC}
            alt="cow-img"
          />
          <div className="page-not-found__title">Page Not Found</div>
          <div className="page-not-found__content">
            <p>This is not the web page you are looking for.</p>
            <p>You will be redirected to the My Range Application home page within 10 seconds.</p>
          </div>
          <div className="page-not-found__link">
            <Link to={HOME}>
              Go to home
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

PageNotFound.propTypes = propTypes;
export default PageNotFound;
