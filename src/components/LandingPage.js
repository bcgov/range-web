import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import * as Routes from '../constants/routes';
import { logout } from '../actions/authActions';

export class LandingPage extends Component {
  state = {
    isSidebarhidden: true,
  }
  
  toggleSidebar = () => {
    this.setState({
      isSidebarhidden: !this.state.isSidebarhidden
    });
  }

  onLogout = () => {
    this.props.logout();
  }

  render() {
    const { component: Component, user, ...rest } = this.props;
    const { isSidebarhidden } = this.state;

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
          <nav className={"sidebar" + (isSidebarhidden ? " sidebar--hidden" : "")} >
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
                to={Routes.LOGIN}
                className="sidebar__list__item"
                onClick={this.onLogout}
              >
                Sign Out
              </NavLink>
            </div>
          </nav>

          <div className="content">
            <Component {...rest} />
          </div>

          <div 
            className={"overlay" + (isSidebarhidden ? " overlay--hidden" : "")} 
            onClick={this.toggleSidebar}
          />
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

export default connect (
  mapStateToProps, { logout }
)(LandingPage)