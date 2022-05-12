// Generic Author Repo Interface
import { BlogAuthor, BlogAuthorData } from '../types';
import { Optional } from 'typescript-optional';

export default interface IBlogAuthorRepo {
  getAll(): Promise<BlogAuthor[]>;
  getById(organizationId: string): Promise<Optional<BlogAuthor>>;
  create(organization: BlogAuthorData): Promise<BlogAuthor>;
  update(organization: BlogAuthor): Promise<BlogAuthor>;
}
