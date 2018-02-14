import React, { Component } from 'react';

class LandingPage extends Component {
  render() {
    const { component: Component, user, ...rest } = this.props;

    return (
      <div>
        {/* <Nav
          toggleSidebar={this.toggleSidebar}
          {...rest}
        /> */}

        <div className="main-container">
          {/* <Sidebar
            isSidebarCollapsed={isSidebarCollapsed}
            {...rest}
          /> */}

          <div className="main-content">
            <Component {...rest} />
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;