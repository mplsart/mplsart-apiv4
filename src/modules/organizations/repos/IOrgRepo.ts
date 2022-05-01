// Generic Org Interface
//import { DatabaseId } from '~/shared/core/types';
import { Organization } from '../types';
import { Optional } from 'typescript-optional';

export default interface IOrgRepo {
  getAll(): Promise<Organization[]>;
  search(term: string): Promise<Organization[]>;
  getById(organizationId: string): Promise<Optional<Organization>>;
  // create(org: Organization): Promise<Organization>;
  // update(org: Organization): Promise<Organization>;
  // delete(org: Organization): Promise<DatabaseId>;
}
