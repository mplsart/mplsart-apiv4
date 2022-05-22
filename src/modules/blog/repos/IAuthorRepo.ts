// Generic Blog Author Repo Interface
import { BlogAuthor, BlogAuthorData } from '../types';
import { Optional } from 'typescript-optional';

export default interface IBlogAuthorRepo {
  getAll(): Promise<BlogAuthor[]>;
  getById(id: string): Promise<Optional<BlogAuthor>>;
  create(data: BlogAuthorData): Promise<BlogAuthor>;
  update(m: BlogAuthor): Promise<BlogAuthor>;
}
