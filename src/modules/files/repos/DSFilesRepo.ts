// Datastore Impementation of IFilesRepo
import IFilesRepo from './IFilesRepo';
import { FileListParamsType, FileContainer, FileContainerData } from '../types';
import { Optional } from 'typescript-optional';
import { Datastore, Key } from '@google-cloud/datastore';

import { get_resource_id_from_key } from '~/infrastructure/datastore/utils';
import { get_entity_by_resource_id } from '~/infrastructure/datastore/utils';
import { get_key_from_resource_id } from '~/infrastructure/datastore/utils';
import { PaginatedResult } from '~/infrastructure/types';

const KIND = 'FileContainer';

// Types for Datastore Payloads
interface Record {
  caption: string;
  created_date: string;
  modified_date: string;
}

interface Entity extends Record {
  [key: symbol]: Key;
  versions: string; // Technically a buffered JSON string...
}

interface WriteData {
  key: Key;
  data: Record;
}

export default class DSFilesRepo implements IFilesRepo {
  datastore: Datastore;
  constructor() {
    this.datastore = new Datastore();
  }

  async getAll(
    params: FileListParamsType
  ): Promise<PaginatedResult<FileContainer>> {
    // Resolve params
    const limit = params.limit;
    const order = params.order;
    const cursor = params.cursor;
    const isDescending = false;

    // Base Query
    let query = this.datastore.createQuery(KIND);

    // Order
    //if (order)
    query.order('modified_date', { descending: isDescending });

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

  async getById(id: string): Promise<Optional<FileContainer>> {
    let r: Record | undefined;
    try {
      r = await get_entity_by_resource_id(this.datastore, KIND, id);
    } catch (err) {
      console.error(err);
    }

    if (!r) return Optional.empty();
    return Optional.of(this.toModel(r as Entity));
  }

  async create(data: FileContainerData): Promise<FileContainer> {
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

  async update(m: FileContainer): Promise<FileContainer> {
    await this.datastore.save(this.toRecord(m));
    return m;
  }

  toModel(r: Entity): FileContainer {
    // Map Datastore Key to Resource Id
    const resource_id = get_resource_id_from_key(r[this.datastore.KEY]);

    const m: Partial<FileContainer> = {
      _meta: {
        resource_id: resource_id,
        resource_type: KIND,
        is_verbose: true
      }
    };

    // Version data...
    let versionStr = '{}';
    if (r.versions) {
      versionStr = r.versions
        .toString()
        .replace(
          new RegExp('http://cdn.mplsart.com', 'g'),
          'https://storage.googleapis.com/cdn.mplsart.com'
        );
    }

    m.caption = r.caption;
    m.created_date = r.created_date;
    m.modified_date = r.modified_date;
    m.versions = JSON.parse(versionStr);
    return m as FileContainer;
  }

  toRecord(m: FileContainer): WriteData {
    // TODO: This could create a partial and we could reuse for create...
    const key = get_key_from_resource_id(this.datastore, m._meta.resource_id);

    return {
      key: key,
      data: {
        caption: m.caption,
        created_date: m.created_date,
        modified_date: m.modified_date
      }
    };
  }
}
