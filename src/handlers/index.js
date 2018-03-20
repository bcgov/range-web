// import validator from 'validator';
import { 
  NOT_PROVIDED, REFERENCE_KEY, UNEXPECTED_ERROR, 
  STATUS404, STATUS500
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

let toastTimeout = null;
export const handleToastMessage = (openToastMessage, closeToastMessage, timeout) => {
  // unregister the timeout to prevent from closing
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  // close the previous message if it was presented
  closeToastMessage();

  // open a new message
  openToastMessage();

  toastTimeout = setTimeout(() => {
    closeToastMessage();
  }, timeout);
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

// class Handlers {
//   constructor() {
//     if(!Handlers.instance) {
//       this._handler = {
//         toastTimeout: undefined
//       };
//       Handlers.instance = this;
//     }
//     return Handlers.instance;
//   }

//   toastMessage(openToastMessage, closeToastMessage, timeout) {
//     // unregister the timeout to prevent from closing
//     if(this._handler.toastTimeout) {
//       clearTimeout(this._handler.toastTimeout);
//     }
//     // close the previous message if it was presented
//     closeToastMessage();
    
//     // open a new message
//     openToastMessage();
  
//     this._handler.toastTimeout = setTimeout(() => {
//       closeToastMessage();
//     }, timeout);
//   }

//   handleErrorMessage(err) {
//     // let message = Strings.UNEXPECTED_ERROR;
    
//     // if(err instanceof Object) {
//     //   const res = err.response;
//     //   const status = err.status;
      
//     //   // got the status of 200
//     //   if (res && res.data && res.data.message) {
//     //     return res.data.message;
//     //   } else if (status) { // able to communicate with the server but errors occured
//     //     if (status === 404) {
//     //       return Strings.STATUS404;
//     //     } else if (status === 500) {
//     //       return Strings.STATUS500;
//     //     }
//     //   }  
//     // }
     
//     // return message; 
//   }

//   validateEmail(email, errors) {
//     // let errorsFound = false;
//     // if (!validator.isEmail(email)) {
//     //   errorsFound = true;
//     //   errors['email'] = Strings.INVALID_EMAIL_FORMAT;
//     // }

//     // return errorsFound;
//   }

//   isPasswordLongEnough(fieldName, password, errors, min = 8) {
//     // let errorsFound = false;
    
//     // if (!validator.isLength(password, {min, max: undefined})) {
//     //   errorsFound = true;

//     //   if (errors[fieldName] instanceof Array) {
//     //     errors[fieldName].push(Strings.SHORT_PASSWORD);
//     //   } else {
//     //     errors[fieldName] = Strings.SHORT_PASSWORD;
//     //   }
//     // }

//     // return errorsFound;
//   }

//   validatePassword(...args) {
//     // let errorsFound = false;
    
//     // if(args.length === 3) {
//     //   const fieldName = args[0]; 
//     //   const password = args[1]; 
//     //   const errors = args[2];
      
//     //   errorsFound = this.isPasswordLongEnough(fieldName, password, errors);
    
//     // } else if(args.length === 5) {
//     //   const firstField = args[0];
//     //   const secondField = args[1];
//     //   const firstPassword = args[2];
//     //   const secondPassword = args[3];
//     //   const errors = args[4];

//     //   errors[firstField] = [];
//     //   errors[secondField] = [];

//     //   if(!validator.equals(firstPassword, secondPassword)) {
//     //     errors[firstField].push(Strings.PASSWORD_NOT_MATCH);
//     //     errors[secondField].push(Strings.PASSWORD_NOT_MATCH);
//     //   }
      
//     //   this.isPasswordLongEnough(firstField, firstPassword, errors);
      
//     //   this.isPasswordLongEnough(secondField, secondPassword, errors);

//     //   if(errors[firstField].length === 0) {
//     //     delete errors[firstField];
//     //   } else {
//     //     errorsFound = true
//     //   }
      
//     //   if(errors[secondField].length === 0) {
//     //     delete errors[secondField];
//     //   } else {
//     //     errorsFound = true
//     //   }
//     // }

//     // return errorsFound;
//   }

//   validateRequiredField(fieldName, field, errors) {
//     // let errorsFound = false;
//     // if(validator.isEmpty(field)) {
//     //   errorsFound = true;
//     //   errors[fieldName] = Strings.FIELD_REQUIRED;
//     // }
//     // return errorsFound;
//   }

// }

// const instance = new Handlers();
// Object.freeze(instance);

// export default instance;