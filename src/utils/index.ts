//
// MyRangeBC
//
// Copyright © 2018 Province of British Columbia
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
import { reduce } from 'lodash';
import { NOT_PROVIDED, NP, UNEXPECTED_ERROR, STATUS404, STATUS500 } from '../constants/strings';
import { getToken } from '../reducers/rootReducer';
import { isBundled } from '../constants/variables';
import type { RootState } from '../reducers/rootReducer';

export { default as axios } from './axios';
export * from './calculation';
export * from './format';
export * from './validation';
export * from './authentication';
export * from './localStorage';
export * from './helper';

interface AxiosRequestConfig {
  headers: {
    Authorization: string;
    'content-type': string;
  };
  maxContentLength: number;
  maxBodyLength: number;
}

export const createConfigWithHeader = (getState: () => RootState): AxiosRequestConfig => {
  const token = getToken(getState());

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    maxContentLength: 100000000,
    maxBodyLength: 1000000000,
  };
};

export const getObjValues = (obj: Record<string, unknown> = {}): unknown[] => Object.keys(obj).map((e) => obj[e]) || [];

export const capitalize = (str = ''): string => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Present user friendly string when getting null or undefined value
 *
 * @param value - the value to check
 * @param fullText - whether to use full "Not provided" text (default true)
 * @param notProvided - custom fallback string
 * @returns the value or a 'Not provided' / 'N/P' fallback
 */
export const handleNullValue = (value: unknown, fullText = true, notProvided?: string): unknown => {
  if (value || value === 0) {
    return value;
  }

  if (notProvided) {
    return notProvided;
  }

  return fullText ? NOT_PROVIDED : NP;
};

interface ErrorLike {
  status?: number;
  message?: string;
  data?: {
    error?: string;
  };
}

/**
 * Parse the network error response to get the error message
 * based on either from the server or the status
 *
 * @param err - The error object
 * @returns an error message string
 */
export const getErrorMessage = (err: unknown): string => {
  const generateMessage = (err: unknown): string => {
    const { status, message } = (err as ErrorLike) || {};
    if (status === 404) return STATUS404;
    if (status === 500) return STATUS500;
    if (message) return `${UNEXPECTED_ERROR} (${message})`;

    return UNEXPECTED_ERROR;
  };

  if (!isBundled) {
    // display error message provided by api in development mode
    const errorObj = err as ErrorLike | null | undefined;
    const msgFromServer = errorObj && errorObj.data && errorObj.data.error;
    if (msgFromServer) {
      return msgFromServer;
    }
  }

  return generateMessage(err);
};

/**
 * detect IE
 * @returns version of IE or false, if browser is not Internet Explorer
 */
export const detectIE = (): number | false => {
  const { userAgent } = window.navigator;

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

  // other browser
  return false;
};

export const sequentialAsyncMap = async <T, U>(
  array: T[],
  iteratee: (value: T, index: number, collection: T[]) => Promise<U>,
): Promise<U[]> =>
  reduce(
    array,
    async (resolvedValuesP: Promise<U[]>, ...args: [T, number, T[]]) => {
      const resolvedValues = await resolvedValuesP;
      const nextValue = await iteratee(...args);

      return [...resolvedValues, nextValue];
    },
    Promise.resolve([] as U[]),
  );

/**
 * Get current year
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};
