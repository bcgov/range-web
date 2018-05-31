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

import { INVALID_GRAZING_SCHEDULE_ENTRY, EMPTY_GRAZING_SCHEDULE_ENTRIES } from '../constants/strings';
import { GRAZING_SCHEDULE_ELEMENT_ID } from '../constants/variables';
import { calcCrownTotalAUMs } from '../handlers';
/**
 * Validate a grazing schedule entry
 *
 * @param {object} entry the grazing schedule entry object
 * @returns {object | undefined} the error object that has error and message properties
 */
export const handleGrazingScheduleEntryValidation = (e = {}) => {
  if (e.dateIn && e.dateOut && e.pastureId && e.livestockTypeId && e.livestockCount) {
    // valid entry
  } else {
    return {
      error: true,
      message: INVALID_GRAZING_SCHEDULE_ENTRY,
    };
  }
  return undefined;
};

/**
 * Validate a grazing schedule
 *
 * @param {object} schedule the grazing schedule object
 * @param {Array} pastures the array of pastures from the plan
 * @param {Array} livestockTypes the array of live stock types
 * @param {Array} usages the array of usages from the agreement
 * @returns {Array} An array of errors
 */
export const handleGrazingScheduleValidation = (schedule = {}, pastures = [], livestockTypes = [], usages = []) => {
  const { year, grazingScheduleEntries: gse } = schedule;
  const grazingScheduleEntries = gse || [];
  const yearUsage = usages.find(u => u.year === year);
  const authorizedAUMs = yearUsage && yearUsage.authorizedAum; 
  const totalCrownTotalAUMs = calcCrownTotalAUMs(grazingScheduleEntries, pastures, livestockTypes);

  const elementId = GRAZING_SCHEDULE_ELEMENT_ID;
  const errors = [];

  if (grazingScheduleEntries.length === 0) {
    errors.push({
      error: true,
      message: EMPTY_GRAZING_SCHEDULE_ENTRIES,
      elementId,
    });
  }

  grazingScheduleEntries.forEach((entry) => {
    const result = handleGrazingScheduleEntryValidation(entry);
    if (result) {
      errors.push({ ...result, elementId });
    }
  });

  if (totalCrownTotalAUMs > authorizedAUMs) {
    errors.push({
      error: true,
      message: 'Total AUMs exceeds authorized AUMs',
      elementId,
    });
  }
  return errors;
};

/**
 * Validate a range use plan
 *
 * @param {Object} plan the range use plan object
 * @param {Array} livestockTypes the array of live stock types
 * @param {Array} usages the array of usages from the agreement
 * @returns {Array} An array of errors
 */
export const handleRupValidation = (plan = {}, livestockTypes = [], usages = []) => {
  const grazingSchedules = plan.grazingSchedules || [];
  const pastures = plan.pastures || [];

  let errors = [];
  grazingSchedules.forEach((schedule) => {
    errors = [...errors, ...handleGrazingScheduleValidation(schedule, pastures, livestockTypes, usages)];
  });
  return errors;
};
