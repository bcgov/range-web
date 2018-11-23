//
// MyRA
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Kyubin Han.
//
import {
  NOT_PROVIDED,
  NP,
  UNEXPECTED_ERROR,
  STATUS404,
  STATUS500,
} from '../constants/strings';
import { getToken } from '../reducers/rootReducer';

export { default as axios } from './axios';
export * from './calculation';
export * from './format';
export * from './validation';
export * from './authentication';
export * from './localStorage';
export * from './helper';

export const createConfigWithHeader = (getState) => {
  const token = getToken(getState());

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  };
};

export const getObjValues = (obj = {}) => Object.keys(obj).map(e => obj[e]) || [];
export const createEmptyArray = (length = 0) => [...Array(length)];

/**
 * Present user friendly string when getting null or undefined value
 *
 * @param {string} value
 * @param {boolean} fullText default is true
 * @returns {string} the value or 'Not provided' or 'N/P'
 */
export const handleNullValue = (value, fullText = true) => {
  if (value || value === 0) {
    return value;
  }
  return fullText ? NOT_PROVIDED : NP;
};

/**
 * Parse the network error response to get the error message
 * based on either from the server or the status
 *
 * @param {err} err The error object
 * @returns an error message string
 */
export const getErrorMessage = (err) => {
  const response = err && err.response;
  if (response) {
    const { data, status } = response;
    const msgFromServer = data && data.error;

    if (msgFromServer) {
      return msgFromServer;
    } else if (status) {
      switch (status) {
        case 404:
          return STATUS404;
        case 500:
          return STATUS500;
        default:
          break;
      }
    }
  }

  const message = err && err.message;
  if (message) {
    return `${UNEXPECTED_ERROR} (${message})`;
  }

  return UNEXPECTED_ERROR;
};

/**
 * Download a pdf file through an a tag using a built-in browser feature
 *
 * https://blog.jayway.com/2017/07/13/open-pdf-downloaded-api-javascript/
 *
 * @param {response.data} blob The binary array buffer from API
 * @param {object} ref The React reference of an a tag
 * @returns undefined
 */
export const downloadPDFBlob = (blob, ref, fileName) => {
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  const newBlob = new Blob([blob], { type: 'application/pdf' });

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob);
  const pdfLink = ref;

  pdfLink.href = data;
  pdfLink.download = fileName;

  // Safari thinks _blank anchor are pop ups. We only want to set _blank
  // target if the browser does not support the HTML5 download attribute.
  // This allows you to download files in desktop safari if pop up blocking is enabled.
  if (typeof pdfLink.download === 'undefined') {
    pdfLink.setAttribute('target', '_blank');
  }

  pdfLink.click();

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
  }, 100);
};

/**
 * detect IE
 * @returns version of IE or false, if browser is not Internet Explorer
 */
export const detectIE = () => {
  const { userAgent } = window.navigator;

  // Test values; Uncomment to check result

  // IE 10
  // userAgent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // userAgent = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  const msie = userAgent.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(userAgent.substring(msie + 5, userAgent.indexOf('.', msie)), 10);
  }

  const trident = userAgent.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = userAgent.indexOf('rv:');
    return parseInt(userAgent.substring(rv + 3, userAgent.indexOf('.', rv)), 10);
  }

  // const edge = userAgent.indexOf('Edge/');
  // if (edge > 0) {
  //   // Edge (IE 12+) => return version number
  //   return parseInt(userAgent.substring(edge + 5, userAgent.indexOf('.', edge)), 10);
  // }

  // other browser
  return false;
};
