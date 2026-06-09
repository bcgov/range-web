/**
 * Compatibility shim for react-router-dom v5 → v6 migration.
 * Provides match, history, and location props to class components
 * that haven't been migrated to hooks yet.
 *
 * TODO: Remove once all components use hooks directly.
 */
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Construct a v5-compatible match object
    const match = {
      params,
      url: location.pathname,
      path: location.pathname,
    };

    // Construct a v5-compatible history object
    const history = {
      push: (path, state) => {
        if (typeof path === 'object') {
          navigate(path.pathname, { state: path.state || state });
        } else {
          navigate(path, { state });
        }
      },
      replace: (path, state) => {
        if (typeof path === 'object') {
          navigate(path.pathname, { state: path.state || state, replace: true });
        } else {
          navigate(path, { state, replace: true });
        }
      },
      goBack: () => navigate(-1),
      location,
    };

    return <Component {...props} match={match} history={history} location={location} />;
  }

  ComponentWithRouterProp.displayName = `withRouter(${Component.displayName || Component.name || 'Component'})`;
  return ComponentWithRouterProp;
}
