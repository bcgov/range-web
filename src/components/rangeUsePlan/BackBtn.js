import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const propTypes = {
  className: PropTypes.string,
  history: PropTypes.shape({}).isRequired,
};

const defaultProps = {
  className: '',
};

const BackBtn = ({ className, history }) => (
  (
    <div
      className={className}
      onClick={history.goBack}
      role="button"
      tabIndex="0"
    >
      <Icon name="arrow left" size="large" />
    </div>
  )
);

BackBtn.propTypes = propTypes;
BackBtn.defaultProps = defaultProps;
export default withRouter(BackBtn);
