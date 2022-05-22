import { DoesNotExistException } from '../../infrastructure/exceptions';
import { DatabaseId } from '../../shared/core/types';
import {
  BlogAuthor,
  BlogAuthorData,
  BlogCategory,
  BlogCategoryData
} from './types';
import IAuthorRepo from './repos/IAuthorRepo';
import ICategoryRepo from './repos/ICategoryRepo';

export default class BlogController {
  private authorRepo: IAuthorRepo;
  private categoryRepo: ICategoryRepo;

  constructor(authorRepo: IAuthorRepo, categoryRepo: ICategoryRepo) {
    this.authorRepo = authorRepo;
    this.categoryRepo = categoryRepo;
  }

  /**
   * Retrieve an `BlogAuthor` by it's datastore resource id
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
  public async getAllAuthors(): Promise<BlogAuthor[]> {
    return await this.authorRepo.getAll();
  }

  public async createAuthor(params: BlogAuthorData): Promise<BlogAuthor> {
    const updated = await this.authorRepo.create(params);
    return updated;
  }

  public async updateAuthor(
    authorId: DatabaseId,
    params: BlogAuthorData
  ): Promise<BlogAuthor> {
    // Ensure exists
    const op = await this.authorRepo.getById(authorId);
    if (op.isEmpty()) throw new DoesNotExistException('Author does not exist');

    const author = op.get();
    author.firstname = params.firstname;
    author.lastname = params.lastname;
    author.website = params.website;

    const updated = await this.authorRepo.update(author);
    return updated;
  }

  // Blog Categories

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

  public async getAllCategories(): Promise<BlogCategory[]> {
    return await this.categoryRepo.getAll();
  }

  public async updateCategory(
    categoryId: DatabaseId,
    params: BlogCategoryData
  ): Promise<BlogAuthor> {
    throw new Error('updateCategory not implemented');
  }

  public async createCategory(params: BlogCategoryData): Promise<BlogCategory> {
    const updated = await this.categoryRepo.create(params);
    return updated;
  }
}
