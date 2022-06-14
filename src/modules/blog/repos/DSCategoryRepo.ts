// Datastore Impementation of ICategoryRepo
import ICategoryRepo from './ICategoryRepo';
import {
  BlogCategory,
  BlogCategoryData,
  CategoryListParams,
  CategoryListParamsType
} from '../types';
import { Optional } from 'typescript-optional';
import { Datastore, Key } from '@google-cloud/datastore';

import { get_resource_id_from_key } from '~/infrastructure/datastore/utils';
import { get_entity_by_resource_id } from '~/infrastructure/datastore/utils';
import { get_key_from_resource_id } from '~/infrastructure/datastore/utils';
import { ConflictException } from '~/infrastructure/exceptions';
import { PaginatedResult } from '~/infrastructure/types';

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

export default class DSCategoryRepo implements ICategoryRepo {
  datastore: Datastore;

  constructor() {
    this.datastore = new Datastore();
  }

  async getAll(
    params: CategoryListParamsType
  ): Promise<PaginatedResult<BlogCategory>> {
    // Resolve params
    const limit = params.limit;
    const order = params.order;
    const cursor = params.cursor;
    const isDescending = true;

    // Base query
    let query = this.datastore.createQuery(KIND);

    // Order
    if (order) query.order(order, { descending: isDescending });

    // Limit
    query = query.limit(limit);

    // Start Cursor
    if (cursor) query.start(cursor);

    // Execute the query
    const result = await this.datastore.runQuery(query);

    // Isolate results
    const more = !(result[1].moreResults == Datastore.NO_MORE_RESULTS);
    const nextCursor = (more && result[1].endCursor) || null;

    return {
      result: result[0].map((r: Record) => this.toModel(r as Entity)),
      more: more,
      nextCursor: nextCursor
    };
  }

  async getBySlug(slug: string): Promise<Optional<BlogCategory>> {
    const clean_slug = slug.toLowerCase().trim();
    const query = this.datastore.createQuery(KIND).filter('slug', clean_slug);
    const [records] = await this.datastore.runQuery(query);

    if (records.length > 0) {
      return Optional.of(this.toModel(records[0] as Entity));
    }
    return Optional.empty();
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

      // Assemble the data to write
      const entity = {
        key: key,
        data: data
      };

      // Ensure there isn't an entity with this slug already
      const dupeCheck = await this.getBySlug(data.slug);
      if (dupeCheck.isPresent()) {
        throw new ConflictException(
          `A category already exists with slug ${data.slug}`
        );
      }

      // Attempt to write the entity
      // ?? If we use txn, key cannot be incomplete. Allocate ids?
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
    // Ensure there isn't a different entity with this slug already
    const dupeCheck = await this.getBySlug(m.slug);
    if (dupeCheck.isPresent()) {
      if (dupeCheck.get()._meta.resource_id != m._meta.resource_id) {
        throw new ConflictException(
          `A category already exists with slug ${m.slug}`
        );
      }
    }

    // Persist to database...
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
