import { Guest } from './Guest';

export interface Household {
  id: string;
  household: string,
  address: string,
  telephone: string,
  email: string,
  members: Guest[]
}