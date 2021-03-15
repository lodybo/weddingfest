import { Guest } from './Guest';

export interface Household {
  id: string;
  sanityID: string;
  household: string,
  address: string,
  telephone: string,
  email: string,
  members: Guest[]
}