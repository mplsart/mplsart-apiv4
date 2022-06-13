import supabase from '~/infrastructure/supabase';
import IUserRepo from './IUserRepo';
import { User, UserData } from '../types';
import { DoesNotExistException } from '~/infrastructure/exceptions';
import { UserRecord } from './types';
import { Optional } from 'typescript-optional';

export default class SupaUserRepo implements IUserRepo {
  /**
   * Get All Organizations
   * @returns A list of Organizations
   */
  // async getAll(): Promise<User[]> {
  //   const { data, error } = await supabase.from<UserRecord>('User').select('*');

  //   if (error) throw Error(error.message);
  //   return data.map((u) => u);
  // }

  /**
   * Search for a list Organizations
   * @returns A list of Organizations
   */
  // async search(term: string): Promise<User[]> {
  //   const { data, error } = await supabase
  //     .from<UserRecord>('User')
  //     .select('*')
  //     .ilike('name', `%${term}%`);

  //   if (error) throw Error(error.message);
  //   return data.map((u) => u) as User[];
  // }

  async getByAuthId(authId: string): Promise<Optional<User>> {
    const resp = await supabase
      .from<UserRecord>('User')
      .select('*')
      .eq('auth_id', authId);

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

    // TODO: Map to `User`
    const orgDao = data[0] as User;
    return Optional.ofNonNull(orgDao);
  }

  async getByEmail(email: string): Promise<Optional<User>> {
    const resp = await supabase
      .from<UserRecord>('User')
      .select('*')
      .eq('primary_email', email);

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

    // TODO: Map to `User`
    const orgDao = data[0] as User;
    return Optional.ofNonNull(orgDao);
  }

  async getById(userId: string): Promise<Optional<User>> {
    const resp = await supabase
      .from<UserRecord>('User')
      .select('*')
      .eq('id', userId);

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

    // TODO: Map to `User`
    const orgDao = data[0] as User;
    return Optional.ofNonNull(orgDao);
  }

  async create(userData: UserData): Promise<User> {
    const o = userData;

    const resp = await supabase.from<UserRecord>('User').insert([
      {
        name: o.name,
        auth_id: o.auth_id,
        primary_email: o.primary_email,
        username: o.username,
        avatar_url: o.avatar_url,
        is_support: o.is_support,
        is_initialized: o.is_initialized,
        is_squelched: o.is_squelched
      }
    ]);

    const { data, error } = resp;
    if (error) throw Error(error.message); // UUID syntax, etc
    if (data.length == 0) throw new DoesNotExistException('Resource');
    return data[0];
  }

  // async rename(userId: string, name: string): Promise<User> {
  //   const resp = await supabase
  //     .from<UserRecord>('User')
  //     .update({ name: name })
  //     .match({ id: userId });

  //   const { data, error } = resp;
  //   if (error) throw Error(error.message); // UUID syntax, etc
  //   if (data.length == 0) throw new DoesNotExistException('Resource');
  //   return data[0];
  // }

  // async update(user: User): Promise<User> {
  //   const o = user;

  //   const resp = await supabase
  //     .from<UserRecord>('User')
  //     .update({
  //       name: o.name,
  //       is_squelched: o.is_squelched
  //     })
  //     .match({ id: o.id });

  //   const { data, error } = resp;
  //   if (error) throw Error(error.message); // UUID syntax, etc
  //   if (data.length == 0) throw new DoesNotExistException('Resource');
  //   return data[0];
  // }

  // Delete should only be done internally. Hold off on implementing...
  // async delete(org: Organization): Promise<DatabaseId> {
  //   return undefined;
  // }
}
