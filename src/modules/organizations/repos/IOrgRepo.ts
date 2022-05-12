// Generic Org Repo Interface
//import { DatabaseId } from '~/shared/core/types';
import { Organization, OrganizationData } from '../types';
import { Optional } from 'typescript-optional';

export default interface IOrgRepo {
  getAll(): Promise<Organization[]>;
  search(term: string): Promise<Organization[]>;
  getById(organizationId: string): Promise<Optional<Organization>>;
  create(organization: OrganizationData): Promise<Organization>;
  update(organization: Organization): Promise<Organization>;
}
