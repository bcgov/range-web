/**
 * This file contains the schema needed for data normalization by using the normalizr (https://github.com/paularmstrong/normalizr) library.
 * Data that goes into Redux should normalized for a few reasons:
 *
 * 1. Prevent deeply nested data: since mutations to the Redux state is not permitted, maintaining a flattened data structure
 *    makes it easy to add/delete data.
 *
 * 2. Reduce data duplication: by reducing data duplication, we maintain a single source of truth for all of the data in our application.
 *    this helps to keep our data in sync, making the application much more scalable.
 *
 * 3. Allows the Redux state to be treated like a database (relationships, tables, etc)
 *
 */

import { schema } from 'normalizr';

// Initialize a new schema for agreements
export const agreement = new schema.Entity('agreements');
export const arrayOfAgreements = new schema.Array(agreement);

export const plan = new schema.Entity('plans');
export const pasture = new schema.Entity('pastures');
export const ministerIssue = new schema.Entity('ministerIssues');
export const grazingSchedule = new schema.Entity('grazingSchedules');
export const grazingScheduleEntry = new schema.Entity('grazingScheduleEntries');

grazingSchedule.define({
  grazingScheduleEntries: [grazingScheduleEntry],
});
// A plan can have many pastures, so it is defined as an array of pastures
plan.define({
  pastures: [pasture],
  ministerIssues: [ministerIssue],
  grazingSchedules: [grazingSchedule],
});
// grazingSchedule.define({ grazingScheduleEntries: [grazingScheduleEntry] });
