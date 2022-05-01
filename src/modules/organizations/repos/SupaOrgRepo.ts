import supabase from '../../../infrastructure/supabase';
import IOrgRepo from './IOrgRepo';
import { Organization } from '../types';
import { DoesNotExistException } from '../../../infrastructure/exceptions';

export default class SupaOrgRepo implements IOrgRepo {
  async getById(organizationId: string): Promise<Organization> {
    const { data, error } = await supabase
      .from('Organization')
      .select('*')
      .eq('id', organizationId);

    if (error) throw Error(error.message); // UUID syntax, etc
    if (data.length == 0) throw new DoesNotExistException('Resource');
    // TODO: Map to `Organization`
    return data[0] as Organization;
  }

  async getAll(): Promise<Organization[]> {
    const { data, error } = await supabase.from('Organization').select('*');
    if (error) throw Error(error.message);

    return data.map((o) => o) as Organization[];
  }
}
