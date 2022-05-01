import supabase from '../../../infrastructure/supabase';
import { Organization } from '../types';

export default interface IOrgRepo {
  getById(organizationId: string): Promise<Organization>;
  //create(org: Organization): Promise<Organization>;
}
