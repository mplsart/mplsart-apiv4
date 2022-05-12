// Datastore Impementation of IAuthorRepo
import IAuthorRepo from './IAuthorRepo';
import { BlogAuthor, BlogAuthorData } from '../types';
import { Optional } from 'typescript-optional';
import { Datastore, Key } from '@google-cloud/datastore';
import { get_resource_id_from_key } from '../../../infrastructure/datastore/utils';

const KIND = 'User';
// Model Representing the Datastore Entity
interface Record {
  [key: symbol]: Key;
  firstname: string;
  lastname: string;
  website: string;
}

export default class DSOrgRepo implements IAuthorRepo {
  datastore: Datastore;
  constructor() {
    this.datastore = new Datastore();
  }

  async getAll(): Promise<BlogAuthor[]> {
    const query = this.datastore.createQuery(KIND).order('lastname');
    const [records] = await this.datastore.runQuery(query);
    return records.map((r: Record) => this.toModel(r));
  }

  async getById(id: string): Promise<Optional<BlogAuthor>> {
    throw Error('not implemented');
  }

  async create(organization: BlogAuthorData): Promise<BlogAuthor> {
    throw Error('not implemented');
  }
  async update(organization: BlogAuthor): Promise<BlogAuthor> {
    throw Error('not implemented');
  }

  toModel(r: Record): BlogAuthor {
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

  toRecord(m: BlogAuthor): Record {
    throw new Error('not implemented');
    // const r: Partial<Record> = {};
    // r.firstname = m.firstname;
    // r.lastname = m.lastname;
    // r.website = m.website;
    // return r as BlogAuthor;
  }
}
