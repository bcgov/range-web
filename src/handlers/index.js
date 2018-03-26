import { 
  NOT_PROVIDED, REFERENCE_KEY, UNEXPECTED_ERROR, STATUS404, STATUS500
} from '../constants/strings';
import moment from 'moment';

export const formatDate = (isoFormatDate) => {
  if(isoFormatDate) {
    //format("dddd, MMMM Do YYYY, h:mm:ss a");
    return moment(isoFormatDate, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MMMM Do, YYYY");
  }
  return NOT_PROVIDED;
};

export const saveReferencesInLocal = (references) => {
  localStorage.setItem(REFERENCE_KEY, JSON.stringify(references));
};

export const getReferencesFromLocal = () => {
  return JSON.parse(localStorage.getItem(REFERENCE_KEY)) || {};
};

export const getErrorMessage = (err) => {
  let message = UNEXPECTED_ERROR;
  
  if(err instanceof Object) {
    const res = err.response;
    const status = err.status;

    if (res && res.data && res.data.error) {
      message = res.data.error;
    } else if (status) {
      switch (status) {
        case 404:
          message = STATUS404;
          break;
        case 500:
          message = STATUS500;
          break;
      
        default:
          break;
      }
    }
  }

  return message; 
};