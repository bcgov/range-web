import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import { userHaveRole, isUserActive } from '../utils';
import { getUserProfile } from '../actionCreators';
import { getUser } from '../reducers/rootReducer';
// import { getReferences, getZones } from '../actions/commonActions';

const propTypes = {
  component: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
  getUserProfile: PropTypes.func.isRequired,
  //   getZones: PropTypes.func.isRequired,
  //   getReferences: PropTypes.func.isRequired,
};
const defaultProps = {
  user: undefined,
};

export class LandingPage extends Component {
  componentDidMount() {
    // const { getReferences, getZones } = this.props;
    // getReferences();
    // getZones();
    this.props.getUserProfile();
  }

  render() {
    const { component: Component, user, ...rest } = this.props;

    return (
      <div className="main">
        <Navbar {...rest} />
        { !isUserActive(user) &&
          <div>This account is not active in the server.</div>
        }
        { userHaveRole(user) &&
          <Component {...rest} />
        }
        <footer />
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    user: getUser(state),
  }
);

LandingPage.propTypes = propTypes;
LandingPage.defaultProps = defaultProps;
// export default connect(mapStateToProps, { getReferences, getZones })(LandingPage);
export default connect(mapStateToProps, { getUserProfile })(LandingPage);
