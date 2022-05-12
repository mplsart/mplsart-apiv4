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
});
