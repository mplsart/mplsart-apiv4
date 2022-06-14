// Generic Blog Author Repo Interface
import { AuthorListParamsType, BlogAuthor, BlogAuthorData } from '../types';
import { Optional } from 'typescript-optional';
import { PaginatedResult } from '~/infrastructure/types';

export default interface IBlogAuthorRepo {
  getAll(params: AuthorListParamsType): Promise<PaginatedResult<BlogAuthor>>;
  getById(id: string): Promise<Optional<BlogAuthor>>;
  create(data: BlogAuthorData): Promise<BlogAuthor>;
  update(m: BlogAuthor): Promise<BlogAuthor>;
}
