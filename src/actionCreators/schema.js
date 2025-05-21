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

export const zone = new schema.Entity('zones');
export const arrayOfZones = new schema.Array(zone);
export const user = new schema.Entity('users');
export const arrayOfUsers = new schema.Array(user);
export const client = new schema.Entity(
  'clients',
  {},
  {
    idAttribute: 'id', // 'clientNumber' is the unique id of Client
  },
);
export const arrayOfClients = new schema.Array(client);

export const plan = new schema.Entity('plans');
export const pasture = new schema.Entity('pastures');
export const plantCommunity = new schema.Entity('plantCommunities');
export const schedule = new schema.Entity('schedules');
export const ministerIssue = new schema.Entity('ministerIssues');
// export const ministerIssueAction = new schema.Entity('ministerIssueActions');
export const additionalRequirements = new schema.Entity('additionalRequirements');
export const managementConsiderations = new schema.Entity('managementConsiderations');
export const confirmation = new schema.Entity('confirmations');
export const planStatusHistory = new schema.Entity('planStatusHistory');

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
