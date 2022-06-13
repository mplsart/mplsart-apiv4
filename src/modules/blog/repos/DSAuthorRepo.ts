// Datastore Impementation of IAuthorRepo
import IAuthorRepo from './IAuthorRepo';
import { BlogAuthor, BlogAuthorData } from '../types';
import { Optional } from 'typescript-optional';
import { Datastore, Key } from '@google-cloud/datastore';
import {
  get_resource_id_from_key,
  get_entity_by_resource_id,
  get_key_from_resource_id
} from '~/infrastructure/datastore/utils';

const KIND = 'User';

// Types for Datastore Payloads
interface Record {
  firstname: string;
  lastname: string;
  website: string;
}

interface Entity extends Record {
  [key: symbol]: Key;
}

interface WriteData {
  key: Key;
  data: Record;
}

export default class DSOrgRepo implements IAuthorRepo {
  datastore: Datastore;
  constructor() {
    this.datastore = new Datastore();
  }

  async getAll(): Promise<BlogAuthor[]> {
    const query = this.datastore.createQuery(KIND).order('lastname');
    const [records] = await this.datastore.runQuery(query);
    return records.map((r: Record) => this.toModel(r as Entity));
  }

  async getById(id: string): Promise<Optional<BlogAuthor>> {
    let r: Record | undefined;
    try {
      r = await get_entity_by_resource_id(this.datastore, KIND, id);
    } catch (err) {
      console.error(err);
    }

    if (!r) return Optional.empty();
    return Optional.of(this.toModel(r as Entity));
  }

  async create(data: BlogAuthorData): Promise<BlogAuthor> {
    const txn = this.datastore.transaction();
    const key = this.datastore.key(KIND);

    try {
      // Start Transaction
      await txn.run();

      // Asseble the data to write
      const entity = {
        key: key,
        data: data
      };

      // Attempt to write the entity
      await this.datastore.save(entity);

      // Attempt to Fetch the newly created entity
      const [record] = await txn.get(key);
      await txn.commit();

      // Finally Map the newly created record
      return this.toModel(record);
    } catch (err) {
      await txn.rollback();
      throw err;
    }
  }

  async update(m: BlogAuthor): Promise<BlogAuthor> {
    await this.datastore.save(this.toRecord(m));
    return m;
  }

  toModel(r: Entity): BlogAuthor {
    // Map Datastore Key to Resource Id
    const resource_id = get_resource_id_from_key(r[this.datastore.KEY]);

    const m: Partial<BlogAuthor> = {
      _meta: {
        resource_id: resource_id,
        resource_type: KIND,
        is_verbose: true
      }
    };

    m.firstname = r.firstname;
    m.lastname = r.lastname;
    m.website = r.website;
    return m as BlogAuthor;
  }

  toRecord(m: BlogAuthor): WriteData {
    // TODO: This could create a partial and we could reuse for create...
    const key = get_key_from_resource_id(this.datastore, m._meta.resource_id);

    return {
      key: key,
      data: {
        firstname: m.firstname,
        lastname: m.lastname,
        website: m.website
      }
    };
  }
}
