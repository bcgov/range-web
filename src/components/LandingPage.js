import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import * as Routes from '../constants/routes';
import { logout } from '../actions/authActions';

const propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
}

export class LandingPage extends Component {
  state = {
    isSidebarHidden: true,
  }
  
  componentWillReceiveProps(nextProps) {
    // navigated!
    if (this.props.location !== nextProps.location) {
      this.closeSidebar();
    }
  }

  closeSidebar = () => {
    this.setState({
      isSidebarHidden: true,
    });
  }

  toggleSidebar = () => {
    this.setState({
      isSidebarHidden: !this.state.isSidebarHidden
    });
  }

  onLogout = () => {
    this.props.logout();
  }

  render() {
    const { component: Component, user, ...rest } = this.props;
    const { isSidebarHidden } = this.state;

    return (
      <div className="landing-page">
        <div className="nav">
          <div className="nav__left">
            <div className="nav__left__icon">
              <Icon 
                size="large" 
                name="bars" 
                onClick={this.toggleSidebar}
              />
            </div>
            <NavLink 
              to={Routes.HOME}
              className="nav__left__title"
            > 
              MyRA
            </NavLink>
          </div>

          <div className="nav__right">
          </div>
        </div>
        
        <div className="main">
          <nav className={"sidebar" + (isSidebarHidden ? " sidebar--hidden" : "")} >
            <div className="sidebar__header"></div>
            <div className="sidebar__list">
              <NavLink 
                to={Routes.HOME}
                className="sidebar__list__item"
                activeClassName="sidebar__list__item--active"
              >
                Home
              </NavLink>
              <NavLink
                id="sign-out"
                to={Routes.LOGIN}
                className="sidebar__list__item"
                onClick={this.onLogout}
              >
                Sign Out
              </NavLink>
            </div>
          </nav>
          
          <div 
            className={"overlay" + (isSidebarHidden ? " overlay--hidden" : "")} 
            onClick={this.toggleSidebar}
          />

          <div className="content">
            <Component {...rest} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.authReducer;
  
  return {
    user
  };  
};

LandingPage.propTypes = propTypes;
export default connect (
  mapStateToProps, { logout }
)(LandingPage)