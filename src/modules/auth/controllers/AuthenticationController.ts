import {
  DoesNotExistException,
  AuthenticationException
} from '../../../infrastructure/exceptions';

import { User, UserData } from '../types';
import IUserRepo from '../repos/IUserRepo';
import supabase from '../../../infrastructure/supabase';
import firebase from '../../../infrastructure/firebase/admin';

// Controller Types
// TODO: Do we need 'result' at this level?
type UserResponse = Promise<{ result: User }>;

export default class AuthenticationController {
  private orgRepo: IUserRepo;

  constructor(repository: IUserRepo) {
    this.orgRepo = repository;
  }

  public async getContextUser(): UserResponse {
    const opUser = await this.orgRepo.getByEmail('blaine@mplsart.com');
    if (opUser.isEmpty())
      throw new DoesNotExistException('Unable to get user account');

    return { result: opUser.get() };
  }

  public async firebaseAuthenticate(idToken: string): UserResponse {
    // TODO: Handle all the expiration events, etc...
    const decodedToken = await firebase.auth.verifyIdToken(idToken);

    console.log(decodedToken);
    console.log(decodedToken.email);
    if (!decodedToken.email) {
      throw Error('unable to resolve email from token');
    }

    //let user: User;
    const opUser = await this.orgRepo.getByEmail(decodedToken.email);
    let user: User;
    if (opUser.isEmpty()) {
      // // Create the user Record...
      const d: UserData = {
        name: decodedToken.name,
        auth_id: '92a93940-5850-475e-82a1-5c3c708c0eef',
        primary_email: decodedToken.email,
        username: 'sporkman', // TODO: Generate a random one...
        avatar_url: decodedToken.picture,
        is_support: false,
        is_initialized: false,
        is_squelched: false
      };
      // Create user
      // TODO: This might need a try/catch
      user = await this.orgRepo.create(d);
    } else {
      // User exists: Simply Return it
      user = opUser.get();
    }

    // TODO: Get user's organization memberships

    return { result: user };
  }

  public async supabaseAuthenticate(token: string): UserResponse {
    const { data: supaUser, error } = await supabase.auth.api.getUser(token);

    console.error(error);
    console.log(supaUser);
    console.log(supaUser?.id);

    // Handle Token Validation Errors
    if (error) {
      if (error.status === 401) {
        // Token is expired
        throw new AuthenticationException(error.message);
      } else {
        // Is there a better error to throw?
        throw new Error(error.message);
      }
    }

    if (!supaUser) {
      throw new Error('Could not decode token');
    }

    let user: User;
    const opUser = await this.orgRepo.getByAuthId(supaUser.id);
    if (opUser.isEmpty()) {
      // Create the user Record...
      const d: UserData = {
        name: supaUser.user_metadata.name,
        auth_id: supaUser.id,
        primary_email: supaUser.email,
        username: 'sporkman', // TODO: Generate a random one...
        avatar_url: supaUser.user_metadata.avatar_url,
        is_support: false,
        is_initialized: false,
        is_squelched: false
      };

      // Create user
      // TODO: This might need a try/catch
      user = await this.orgRepo.create(d);
      //throw new DoesNotExistException('User does not exist');
    } else {
      // User exists: Simply Return it
      user = opUser.get();
    }

    // TODO: Get user's organization memberships

    return { result: user };
  }
}
