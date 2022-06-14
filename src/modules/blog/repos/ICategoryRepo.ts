// Generic Blog Category Repo Interface
import { BlogCategory, BlogCategoryData, CategoryListParams } from '../types';
import { Optional } from 'typescript-optional';
import { PaginatedResult } from '~/infrastructure/types';

export default interface IBlogCategoryRepo {
  getAll(params: CategoryListParams): Promise<PaginatedResult<BlogCategory>>;
  getById(id: string): Promise<Optional<BlogCategory>>;
  getBySlug(slug: string): Promise<Optional<BlogCategory>>;
  create(data: BlogCategoryData): Promise<BlogCategory>;
  update(m: BlogCategory): Promise<BlogCategory>;
}
