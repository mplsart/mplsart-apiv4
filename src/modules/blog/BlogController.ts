// Blog Controller
import { DoesNotExistException } from '~/infrastructure/exceptions';
import { PaginatedResult } from '~/infrastructure/types';

import { DatabaseId } from '~/shared/core/types';
import { AuthorListParamsType } from './types';
import { BlogAuthor } from './types';
import { CategoryListParamsType } from './types';

import { BlogAuthorData } from './types';
import { BlogCategory } from './types';
import { BlogCategoryData } from './types';
import IAuthorRepo from './repos/IAuthorRepo';
import ICategoryRepo from './repos/ICategoryRepo';

export default class BlogController {
  private authorRepo: IAuthorRepo;
  private categoryRepo: ICategoryRepo;

  constructor(authorRepo: IAuthorRepo, categoryRepo: ICategoryRepo) {
    this.authorRepo = authorRepo;
    this.categoryRepo = categoryRepo;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Blog Authors
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Retrieve an `BlogAuthor` by its datastore resource id
   * @param resourceId The `RESOURCE_ID` of the requested `BlogAuthor`
   * @returns BlogAuthor
   */

  public async getAuthorByResourceId(resourceId: string): Promise<BlogAuthor> {
    const op = await this.authorRepo.getById(resourceId);
    if (op.isEmpty()) throw new DoesNotExistException('Author does not exist');
    return op.get();
  }

  /**
   * Fetch a list of all authors
   * @returns A list of BlogAuthor Models
   */
  public async getAllAuthors(
    params: AuthorListParamsType
  ): Promise<PaginatedResult<BlogAuthor>> {
    return await this.authorRepo.getAll(params);
  }

  /**
   * Create a new author record
   * @param params Data for new Author Record
   * @returns Hydrated BlogAuthor record
   */
  public async createAuthor(params: BlogAuthorData): Promise<BlogAuthor> {
    return await this.authorRepo.create(params);
  }

  /**
   * Update data about an Author
   * @param authorId Database Id of the author to update
   * @param params Data for new Author Record
   * @returns Hydrated BlogAuthor record
   */
  public async updateAuthor(
    authorId: DatabaseId,
    params: BlogAuthorData
  ): Promise<BlogAuthor> {
    // Ensure exists
    const op = await this.authorRepo.getById(authorId);
    if (op.isEmpty()) throw new DoesNotExistException('Author does not exist');

    // Update fields
    const author = op.get();
    author.firstname = params.firstname;
    author.lastname = params.lastname;
    author.website = params.website;

    // Persist
    const updated = await this.authorRepo.update(author);
    return updated;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Blog Categories
  //////////////////////////////////////////////////////////////////////////////
  public async getCategoryBySlug(slug: string): Promise<BlogCategory> {
    const op = await this.categoryRepo.getBySlug(slug);
    if (op.isEmpty())
      throw new DoesNotExistException(
        `Category with slug ${slug} does not exist`
      );
    return op.get();
  }

  public async getCategoryByResourceId(
    resourceId: string
  ): Promise<BlogCategory> {
    const op = await this.categoryRepo.getById(resourceId);
    if (op.isEmpty())
      throw new DoesNotExistException(`Category does not exist`);
    return op.get();
  }

  public async getAllCategories(
    params: CategoryListParamsType
  ): Promise<PaginatedResult<BlogCategory>> {
    return await this.categoryRepo.getAll(params);
  }

  public async updateCategory(
    categoryId: DatabaseId,
    params: BlogCategoryData
  ): Promise<BlogCategory> {
    // Ensure exists
    const op = await this.categoryRepo.getById(categoryId);
    if (op.isEmpty())
      throw new DoesNotExistException('Category does not exist');

    // Update fields
    const category = op.get();
    category.slug = params.slug;
    category.site_id = params.site_id;
    category.title = params.title;

    // Persist
    return await this.categoryRepo.update(category);
  }

  public async createCategory(params: BlogCategoryData): Promise<BlogCategory> {
    return await this.categoryRepo.create(params);
  }
}
