// Generic Blog Category Repo Interface
import { BlogCategory, BlogCategoryData } from '../types';
import { Optional } from 'typescript-optional';

export default interface IBlogCategoryRepo {
  getAll(): Promise<BlogCategory[]>;
  getById(id: string): Promise<Optional<BlogCategory>>;
  create(data: BlogCategoryData): Promise<BlogCategory>;
  update(m: BlogCategory): Promise<BlogCategory>;
}
