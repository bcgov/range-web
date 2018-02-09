import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';

import '../styles/App.css';
import * as Routes from '../constants/routes';

import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import Login from './auths/Login';
import Home from './Home';
import Toast from './Toast';
import PageNotFound from './PageNotFound';

import Auth from '../handlers/auth';
import { logout } from '../actions/authActions';

export class App extends Component {
  componentDidMount() {
    Auth.registerAxiosInterceptor(this.props.logout);
  }

  render() {
    const { user } = this.props;
    
    return (
      <div>
        <BrowserRouter>
          <Switch>
            
            <PublicRoute path={Routes.LOGIN} component={Login} user={user} />
            <PrivateRoute path={Routes.HOME} component={Home} user={user} />

            
            {/* An example of nested routes 
              https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#serving-apps-with-client-side-routing
              <PrivateRoute path={`${match.url}/:topicId`} component={Topic} user={user}/>
              <PrivateRoute exact path={match.url} component={TopicPage} user={user}/>
            */}
            
            <Route path='/' exact render={() => (<Redirect to={Routes.LOGIN}/>)} />
            <Route path='*' exact component={PageNotFound} />

          </Switch>
        </BrowserRouter>
        <Toast />
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
)(App)
