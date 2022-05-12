import AuthController from './AuthenticationController';
import SupaUserRepo from '../repos/SupaUserRepo';
import { jest } from '@jest/globals';
import { Optional } from 'typescript-optional';
import { User } from '../types';
import { DoesNotExistException } from '../../../infrastructure/exceptions';

jest.mock('../repos/SupaUserRepo');
jest.mock('@supabase/supabase-js');
jest.mock('firebase-admin', () => ({
  apps: [],
  credential: {
    cert: jest.fn()
  },
  initializeApp: jest.fn(),
  auth: jest.fn(),
  firestore: jest.fn()
}));

describe('AuthController.getContextUser should', () => {
  test('should throw DNE when email is unknown', async () => {
    const MockUserRepo = SupaUserRepo as jest.Mock<SupaUserRepo>;
    const mockResult: Optional<User> = Optional.empty();
    MockUserRepo.mockImplementation(() => {
      return {
        getByAuthId: jest.fn(),
        getByEmail: jest.fn(() => Promise.resolve(mockResult)),
        getById: jest.fn(),
        create: jest.fn()
      };
    });

    const userRepo = new SupaUserRepo();
    const controller = new AuthController(userRepo);

    // Run Code to Test & Check Results
    await expect(controller.getContextUser()).rejects.toThrowError(
      DoesNotExistException
    );
  });

  test('should return User when email matches', async () => {
    const fakeUser: User = {
      id: 'fake0123',
      name: 'fakeUser',
      primary_email: 'fake@fake.com',
      created_at: '',
      updated_at: '',
      is_support: false,
      is_initialized: true,
      is_squelched: false
    };

    const MockUserRepo = SupaUserRepo as jest.Mock<SupaUserRepo>;
    const mockResult: Optional<User> = Optional.of(fakeUser);

    MockUserRepo.mockImplementation(() => {
      return {
        getByAuthId: jest.fn(),
        getByEmail: jest.fn(() => Promise.resolve(mockResult)),
        getById: jest.fn(),
        create: jest.fn()
      };
    });

    const userRepo = new SupaUserRepo();
    const controller = new AuthController(userRepo);

    // Run Code to Test & Check Results
    await expect(controller.getContextUser()).resolves.toEqual(fakeUser);
  });
});
