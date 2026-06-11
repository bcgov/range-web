import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';
import { removeToast } from '../../actions';
import { getToastsMap } from '../../reducers/rootReducer';
import { getObjValues } from '../../utils';
import { extendSession } from '../../actionCreators';
import SessionExpiryWarning from '../common/SessionExpiryWarning/SessionExpiryWarning';
import { RootState, AppDispatch } from '../../configureStore';

const Toasts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toastsMap = useSelector((state: RootState) => getToastsMap(state));

  const handleRemoveToast = (toast: any) => () => {
    dispatch(removeToast({ toastId: toast.id }));
  };

  const handleExtendSession = () => {
    dispatch(extendSession() as any);
  };

  const renderToast = (toast: any) => {
    const { id, text, success, isCountdown } = toast;
    const iconClassName = classnames('toast__icon', {
      toast__icon__success: success,
      toast__icon__error: !success,
    });

    return (
      <div key={id} className="toast">
        <div className={iconClassName}>
          {success && <Icon name="check circle" size="large" />}
          {!success && <Icon name="warning circle" size="large" />}
        </div>
        {isCountdown ? <SessionExpiryWarning onExtend={handleExtendSession} /> : <div className="toast__content">{text}</div>}
        <button className="toast__dismiss" onClick={handleRemoveToast(toast)}>
          <Icon name="times" size="small" />
        </button>
      </div>
    );
  };

  const toasts = getObjValues(toastsMap);

  return <section className="toasts">{toasts.map(renderToast)}</section>;
};

export default Toasts;
