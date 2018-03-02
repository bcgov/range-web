import React, { Component } from 'react';
import { RANGE_USE_PLANS } from '../constants/routes';
import { Link } from 'react-router-dom';

class PageNotFound extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.history.push(RANGE_USE_PLANS);
    }, 10000);
  }

  render() {
    return (
      <div className="page-not-found">
        <div>
          <div className="page-not-found__title">Error 404</div>
          <div className="page-not-found__content">Woops. Looks like this page doesn't exist </div>
          <div className="page-not-found__link">
            <Link to={RANGE_USE_PLANS}> Go to home </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default PageNotFound;