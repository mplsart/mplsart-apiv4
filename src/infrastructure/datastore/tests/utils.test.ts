/* eslint-env jest */
import { Datastore } from '@google-cloud/datastore';
import { fail } from 'assert';
import {
  get_resource_id_from_key,
  get_key_from_resource_id,
  get_entity_by_resource_id
} from '../utils';

describe('get_resource_id_from_key should', () => {
  describe('successfully generate resource_id from key', () => {
    test('for known case Gamut', () => {
      // This is a known edge case
      const datastore = new Datastore();
      const k = datastore.key(['Venue', 'gamut']);
      expect('VmVudWUeZ2FtdXQ').toBe(get_resource_id_from_key(k));
    });

    test('string id', () => {
      const datastore = new Datastore();
      const k = datastore.key(['UserEntity', 'does_not_exist']);
      expect('VXNlckVudGl0eR5kb2VzX25vdF9leGlzdA').toBe(
        get_resource_id_from_key(k)
      );
    });

    test('int id', () => {
      const datastore = new Datastore();
      const k = datastore.key(['UserEntity', 1]);
      expect('VXNlckVudGl0eR4fMQ').toBe(get_resource_id_from_key(k));
    });
  });

  // Exceptions
  describe('throw exception when', () => {
    test('there is only a Kind', () => {
      const expected =
        'Key does not appear to be persisted to datastore. Received path: UserEntity,';
      const datastore = new Datastore();
      const k = datastore.key(['UserEntity']);
      // InvalidDatastoreKey
      expect(() => get_resource_id_from_key(k)).toThrow(expected);
    });

    test('there are an odd number of path params', () => {
      const expected =
        'Key does not appear to be persisted to datastore. Received path: UserEntity,1,Child,';
      const datastore = new Datastore();
      const k = datastore.key(['UserEntity', 1, 'Child']);
      // InvalidDatastoreKey
      expect(() => get_resource_id_from_key(k)).toThrow(expected);
    });
  });
});

describe('get_key_from_resource_id should', () => {
  describe('successfully recreate key from resource_id', () => {
    test('for known case Gamut', () => {
      const datastore = new Datastore();
      const k = get_key_from_resource_id(datastore, 'VmVudWUeZ2FtdXQ');
      expect(k.path).toEqual(['Venue', 'gamut']);
    });

    test('for key name', () => {
      const datastore = new Datastore();
      const k = get_key_from_resource_id(
        datastore,
        'VXNlckVudGl0eR5kb2VzX25vdF9leGlzdA'
      );
      expect(k.path).toEqual(['UserEntity', 'does_not_exist']);
    });

    test('for int key id', () => {
      const datastore = new Datastore();
      const k = get_key_from_resource_id(datastore, 'VXNlckVudGl0eR4fMQ');
      expect(k.path).toEqual(['UserEntity', 1]);
    });

    test('for known case Gamut', () => {
      const datastore = new Datastore();
      const k = get_key_from_resource_id(
        datastore,
        'RXZlbnQeHzU2OTE5MDI1OTA0NTE3MTI'
      );
      expect(k.path).toEqual(['Event', 5691902590451712]);
    });
  });
});

describe('get_key_from_resource_id should', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  test('call datastore.get() with expected arguments', async () => {
    const datastore = new Datastore();
    const k = datastore.key(['Venue', 'gamut']);

    const mockDatastore = {
      key: jest.fn(() => k),
      get: jest.fn(() => ['mockGetValue'])
    };

    // Run Code To Test
    const result = await get_entity_by_resource_id(
      mockDatastore as unknown as Datastore,
      'Venue',
      'VmVudWUeZ2FtdXQ'
    );
    expect(mockDatastore.get).toBeCalledWith(k);
    expect(result).toBe('mockGetValue');
  });

  test('throw with non-matching kind', async () => {
    //expect.assertions(1);
    const datastore = new Datastore();
    const k = datastore.key(['Invalid', 'kind']);

    const mockDatastore = {
      key: jest.fn(() => k),
      get: jest.fn(() => Promise.resolve(['mockGetValue']))
    };

    // Run Code To Test
    try {
      await get_entity_by_resource_id(
        mockDatastore as unknown as Datastore,
        'Venue',
        'VmVudWUeZ2FtdXQ'
      );
      fail('Test unexpectedly passsed');
    } catch (e) {
      // Ensure exception was thrown
      const err = e as Error;
      expect(err.message).toEqual(
        'Expected key for kind Venue but found kind Invalid instead.'
      );
    }
  });
});
