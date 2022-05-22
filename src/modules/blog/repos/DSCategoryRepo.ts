// Datastore Impementation of ICategoryRepo
import ICategoryRepo from './ICategoryRepo';
import { BlogCategory, BlogCategoryData } from '../types';
import { Optional } from 'typescript-optional';
import { Datastore, Key } from '@google-cloud/datastore';
import {
  get_resource_id_from_key,
  get_entity_by_resource_id,
  get_key_from_resource_id
} from '../../../infrastructure/datastore/utils';

const KIND = 'BlogCategory';

// Types for Datastore Payloads
interface Record {
  site_id: string;
  title: string;
  slug: string;
}

interface Entity extends Record {
  [key: symbol]: Key;
}

interface WriteData {
  key: Key;
  data: Record;
}

export default class DSOrgRepo implements ICategoryRepo {
  datastore: Datastore;

  constructor() {
    this.datastore = new Datastore();
  }

  async getAll(): Promise<BlogCategory[]> {
    const query = this.datastore.createQuery(KIND).order('slug');
    const [records] = await this.datastore.runQuery(query);
    return records.map((r: Record) => this.toModel(r as Entity));
  }

  async getById(id: string): Promise<Optional<BlogCategory>> {
    let r: Record | undefined;
    try {
      r = await get_entity_by_resource_id(this.datastore, KIND, id);
    } catch (err) {
      console.error(err);
    }

    if (!r) return Optional.empty();
    return Optional.of(this.toModel(r as Entity));
  }

  async create(data: BlogCategoryData): Promise<BlogCategory> {
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

  async update(m: BlogCategory): Promise<BlogCategory> {
    await this.datastore.save(this.toRecord(m));
    return m;
  }

  toModel(r: Entity): BlogCategory {
    // Map Datastore Key to Resource Id
    const resource_id = get_resource_id_from_key(r[this.datastore.KEY]);

    const m: Partial<BlogCategory> = {
      _meta: {
        resource_id: resource_id,
        resource_type: KIND,
        is_verbose: true
      }
    };

    m.slug = r.slug;
    m.title = r.title;
    m.site_id = r.site_id;
    return m as BlogCategory;
  }

  toRecord(m: BlogCategory): WriteData {
    // TODO: This could create a partial and we could reuse for create...
    const key = get_key_from_resource_id(this.datastore, m._meta.resource_id);

    return {
      key: key,
      data: {
        slug: m.slug,
        title: m.title,
        site_id: m.site_id
      }
    };
  }
}