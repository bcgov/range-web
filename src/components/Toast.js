import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { removeToast } from '../actions';
import { getToastsMap } from '../reducers/rootReducer';
import { getObjValues } from '../utils';

const propTypes = {
  toastsMap: PropTypes.shape({}).isRequired,
  removeToast: PropTypes.func.isRequired,
};

class Toasts extends Component {
  removeToast = toast => () => {
    const { removeToast } = this.props;

    removeToast({
      toastId: toast.id,
    });
  }

  renderToast = (toast) => {
    const { id, text, success } = toast;
    const className = classnames('toast', {
      'toast__success': success,
      'toast__error': !success,
    });

    return (
      <li key={id} className={className}>
        <p className="toast__content">
          {text}
        </p>
        <button className="toast__dismiss" onClick={this.removeToast(toast)}>
          x
        </button>
      </li>
    );
  }

  render() {
    const toasts = getObjValues(this.props.toastsMap);

    return (
      <ul className="toasts">
        {toasts.map(this.renderToast)}
      </ul>
    );
  }
}


const mapStateToProps = state => ({
  toastsMap: getToastsMap(state),
});
Toasts.propTypes = propTypes;
export default connect(mapStateToProps, { removeToast })(Toasts);
