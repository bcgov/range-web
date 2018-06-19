import { schema } from 'normalizr';

export const agreement = new schema.Entity('agreements');
export const arrayOfAgreements = new schema.Array(agreement);
