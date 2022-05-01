import supabase from '../../../infrastructure/supabase';
import IOrgRepo from './IOrgRepo';
import { Organization } from '../types';
import { DoesNotExistException } from '../../../infrastructure/exceptions';
import { OrganizationRecord } from './types';
import { Optional } from 'typescript-optional';

export default class SupaOrgRepo implements IOrgRepo {
  /**
   * Get All Organizations
   * @returns A list of Organizations
   */
  async getAll(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from<OrganizationRecord>('Organization')
      .select('*');

    if (error) throw Error(error.message);
    return data.map((o) => o) as Organization[];
  }

  /**
   * Search for a list Organizations
   * @returns A list of Organizations
   */
  async search(term: string): Promise<Organization[]> {
    console.log('here...');
    const { data, error } = await supabase
      .from<OrganizationRecord>('Organization')
      .select('*')
      .ilike('name', `%${term}%`);

    console.log(`%${term}%`);
    // TOOD: Search params
    if (error) throw Error(error.message);
    return data.map((o) => o) as Organization[];
  }

  async getById(organizationId: string): Promise<Optional<Organization>> {
    const resp = await supabase
      .from<OrganizationRecord>('Organization')
      .select('*')
      .eq('id', organizationId);

    const { data, error } = resp;
    if (error) throw Error(error.message); // UUID syntax, etc
    if (data.length == 0) throw new DoesNotExistException('Resource');

    // TODO: Map to `Organization`
    const orgDao = data[0] as Organization;

    return Optional.ofNonNull(orgDao);
    //return data[0] as Organization;
  }

  // async create(org: Organization): Promise<Organization> {
  //   return undefined;
  // }

  // async update(org: Organization): Promise<Organization> {
  //   return undefined;
  // }

  // async delete(org: Organization): Promise<DatabaseId> {
  //   return undefined;
  // }
}
