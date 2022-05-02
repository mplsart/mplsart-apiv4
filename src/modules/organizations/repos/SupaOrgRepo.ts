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
    return data.map((o) => o);
  }

  /**
   * Search for a list Organizations
   * @returns A list of Organizations
   */
  async search(term: string): Promise<Organization[]> {
    const { data, error } = await supabase
      .from<OrganizationRecord>('Organization')
      .select('*')
      .ilike('name', `%${term}%`);

    if (error) throw Error(error.message);
    return data.map((o) => o) as Organization[];
  }

  async getById(organizationId: string): Promise<Optional<Organization>> {
    const resp = await supabase
      .from<OrganizationRecord>('Organization')
      .select('*')
      .eq('id', organizationId);

    const { data, error } = resp;

    // Handle error...
    // TODO: We may want to validate the id before...
    if (error) {
      if (error.code == '22P02') {
        return Optional.empty();
      } else {
        //TODO:  We probably wan to re-work this
        throw Error(error.message); // UUID syntax, etc
      }
    }

    if (data.length == 0) return Optional.empty();

    // TODO: Map to `Organization`
    const orgDao = data[0] as Organization;
    return Optional.ofNonNull(orgDao);
  }

  async create(name: string): Promise<Organization> {
    const resp = await supabase
      .from<OrganizationRecord>('Organization')
      .insert([{ name: name }]);

    const { data, error } = resp;
    if (error) throw Error(error.message); // UUID syntax, etc
    if (data.length == 0) throw new DoesNotExistException('Resource');
    return data[0];
  }

  async rename(organizationId: string, name: string): Promise<Organization> {
    const resp = await supabase
      .from<OrganizationRecord>('Organization')
      .update({ name: name })
      .match({ id: organizationId });

    const { data, error } = resp;
    if (error) throw Error(error.message); // UUID syntax, etc
    if (data.length == 0) throw new DoesNotExistException('Resource');
    return data[0];
  }

  async update(organization: Organization): Promise<Organization> {
    const o = organization;

    const resp = await supabase
      .from<OrganizationRecord>('Organization')
      .update({
        name: o.name,
        is_squelched: o.is_squelched
      })
      .match({ id: o.id });

    const { data, error } = resp;
    if (error) throw Error(error.message); // UUID syntax, etc
    if (data.length == 0) throw new DoesNotExistException('Resource');
    return data[0];
  }

  // Delete should only be done internally. Hold off on implementing...
  // async delete(org: Organization): Promise<DatabaseId> {
  //   return undefined;
  // }
}
