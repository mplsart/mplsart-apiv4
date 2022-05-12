// Datastore Impementation of IAuthorRepo
import IAuthorRepo from './IAuthorRepo';
import { BlogAuthor, BlogAuthorData } from '../types';
import { Optional } from 'typescript-optional';
import { Datastore } from '@google-cloud/datastore';

export default class DSOrgRepo implements IAuthorRepo {
  async getAll(): Promise<BlogAuthor[]> {
    const datastore = new Datastore(); // TODO: Singleton

    const query = datastore.createQuery('User').order('firstname');
    const [entites] = await datastore.runQuery(query);

    return entites.map((o) => o);
  }

  async getById(organizationId: string): Promise<Optional<BlogAuthor>> {
    throw Error('not implemented');
  }
  async create(organization: BlogAuthorData): Promise<BlogAuthor> {
    throw Error('not implemented');
  }
  async update(organization: BlogAuthor): Promise<BlogAuthor> {
    throw Error('not implemented');
  }
}
