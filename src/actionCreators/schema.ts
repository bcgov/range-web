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
export const agreement: schema.Entity = new schema.Entity('agreements');

export const zone: schema.Entity = new schema.Entity('zones');
export const user: schema.Entity = new schema.Entity('users');
export const arrayOfUsers: schema.Array = new schema.Array(user);
export const client: schema.Entity = new schema.Entity(
  'clients',
  {},
  {
    idAttribute: 'id', // 'clientNumber' is the unique id of Client
  },
);

export const plan: schema.Entity = new schema.Entity('plans');
export const pasture: schema.Entity = new schema.Entity('pastures');
export const plantCommunity: schema.Entity = new schema.Entity('plantCommunities');
export const schedule: schema.Entity = new schema.Entity('schedules');
export const ministerIssue: schema.Entity = new schema.Entity('ministerIssues');
// export const ministerIssueAction = new schema.Entity('ministerIssueActions');
export const additionalRequirements: schema.Entity = new schema.Entity('additionalRequirements');
export const managementConsiderations: schema.Entity = new schema.Entity('managementConsiderations');
export const confirmation: schema.Entity = new schema.Entity('confirmations');
export const planStatusHistory: schema.Entity = new schema.Entity('planStatusHistory');

pasture.define({
  plantCommunities: [plantCommunity],
});
// ministerIssue.define({
//   ministerIssueActions: [ministerIssueAction],
// });

// A plan can have many pastures, so it is defined as an array of pastures
plan.define({
  pastures: [pasture],
  ministerIssues: [ministerIssue],
  schedules: [schedule],
  confirmations: [confirmation],
  planStatusHistory: [planStatusHistory],
  additionalRequirements: [additionalRequirements],
  managementConsiderations: [managementConsiderations],
});
