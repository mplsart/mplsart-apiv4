// Datastore Utilities
import { Datastore, Key } from '@google-cloud/datastore';
import { InvalidDatastoreKey } from './errors';
import { InvalidResourceId } from './errors';
import { UnexpectedDatastoreKind } from './errors';
import { RESOURCE_ID } from '~/shared/core/types';

const SEPARATOR = String.fromCharCode(30);
const INTPREFIX = String.fromCharCode(31);

/**
 * Generate an portable resource id string from a datastore key
 * @param key Instance of datastore.Key
 * @returns string RESOURCE_ID
 */
export function get_resource_id_from_key(key: Key): RESOURCE_ID {
  /*
    Convert a ndb.Key() into a portable `str` resource id
    :param key: An instance of `ndb.Key`
  */
  //https://github.com/googleapis/nodejs-datastore/blob/master/samples/concepts.js

  // Ducktype check the key
  if (!key || !key.path) {
    throw new InvalidDatastoreKey(
      'Argument Key must be an instance of Datastore Key'
    );
  }

  // Validate that key is persisted - last val will be undefined
  if (key.path[key.path.length - 1] === undefined) {
    throw new InvalidDatastoreKey(
      'Key does not appear to be persisted to datastore. Received path: ' +
        key.path
    );
  }

  const bits = key.path.map((bit, i) => {
    if (i % 2 === 1) {
      if (typeof bit === 'number') {
        bit = INTPREFIX + bit.toString();
      } else if (typeof bit == 'string') {
        // TODO: This will convert "1234" to 1234, which...
        // node + google + 64 bit ints = chaos

        if (!isNaN(bit as unknown as number)) {
          bit = INTPREFIX + bit.toString();
        }
      }
    }
    return bit;
  });

  const buff = Buffer.from(bits.join(SEPARATOR));
  const base64data = buff.toString('base64');
  return base64data.replace(new RegExp('=', 'g'), '');
}

/**
 * Hydrate a datastore key from a portable resource id string
 * @param datastoreClient Instance of Datastore
 * @param resource_id string RESOURCE_ID
 * @returns Instance of datastore.Key
 */
export function get_key_from_resource_id(
  datastoreClient: Datastore,
  resource_id: RESOURCE_ID
): Key {
  // Validate Datastore Client - ducktype...
  if (typeof datastoreClient.key != 'function') {
    throw new TypeError(
      'First argumemnt should be an instance of DatastoreClient'
    );
  }

  // Validate resource Id
  if (!resource_id || typeof resource_id != 'string' || resource_id === '') {
    throw new InvalidResourceId(
      'Resource Ids must be an instance of str. Received:' + resource_id
    );
  }

  const buff = Buffer.from(resource_id, 'base64');
  const text = buff.toString('utf8');
  const bits = text.split(SEPARATOR);

  const path = bits.map((bit) => {
    if (bit[0] == INTPREFIX) {
      const intStr = bit.replace(INTPREFIX, '');
      // Note: This seems to be working with 16digit longs
      return Number(intStr);
    }
    return bit;
  });

  const key = datastoreClient.key(path);
  return key;
}

/**
 * Fetch an Entity from the Datastore given a resource_id
 * @param datastoreClient Instance of Datastore
 * @param expectedKind Expected Kind
 * @param resource_id string RESOURCE_ID
 * @returns
 */
export async function get_entity_by_resource_id<EntityType>(
  datastoreClient: Datastore,
  expectedKind: string,
  resource_id: RESOURCE_ID
): Promise<EntityType | undefined> {
  // TODO: Better handling of errors

  if (!resource_id || typeof resource_id != 'string' || resource_id == '') {
    throw new InvalidResourceId(
      'Resource Ids must be an instance of str. Received:' + resource_id
    );
  }

  const key = get_key_from_resource_id(datastoreClient, resource_id);
  if (key.kind != expectedKind) {
    throw new UnexpectedDatastoreKind(
      'Expected key for kind ' +
        expectedKind +
        ' but found kind ' +
        key.kind +
        ' instead.'
    );
  }

  const result = await datastoreClient.get(key);
  const [entity] = result;
  return entity as EntityType | undefined;
}
