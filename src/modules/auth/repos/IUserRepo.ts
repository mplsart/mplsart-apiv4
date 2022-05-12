// Generic User Repo Interface
//import { DatabaseId } from '~/shared/core/types';
import { Optional } from 'typescript-optional';
import { DatabaseId } from '~/shared/core/types';
import { User, UserData } from '../types';

export default interface IUserRepo {
  getByAuthId(authId: DatabaseId): Promise<Optional<User>>;
  getByEmail(email: string): Promise<Optional<User>>;
  getById(userId: DatabaseId): Promise<Optional<User>>;
  create(userData: UserData): Promise<User>;
}
