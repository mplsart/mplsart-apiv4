import { DoesNotExistException } from '../../infrastructure/exceptions';
import { DatabaseId } from '../../shared/core/types';
import { BlogAuthor, BlogAuthorData } from './types';
import IAuthorRepo from './repos/IAuthorRepo';

export default class BlogController {
  private authorRepo: IAuthorRepo;

  constructor(authorRepo: IAuthorRepo) {
    this.authorRepo = authorRepo;
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

  // public async search(term: string): Promise<Organization[]> {
  //   return await this.orgRepo.search(term);
  // }

  public async create(params: BlogAuthorData): Promise<BlogAuthor> {
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

  // public async squelch(organizationId: DatabaseId): Promise<Organization> {
  //   // Ensure organization exists
  //   const orgOp = await this.orgRepo.getById(organizationId);
  //   if (orgOp.isEmpty())
  //     throw new DoesNotExistException('Organization does not exist');

  //   const org = orgOp.get();
  //   org.is_squelched = true;
  //   const newOrg = await this.orgRepo.update(org);
  //   return newOrg;
  // }
}
