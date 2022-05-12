import { DoesNotExistException } from '../../../infrastructure/exceptions';
import { DatabaseId } from '../../../shared/core/types';
import { Organization, OrganizationData } from '../types';
import IOrgRepo from '../repos/IOrgRepo';

// Controller Types
export default class OrganizationsController {
  private orgRepo: IOrgRepo;

  constructor(repository: IOrgRepo) {
    this.orgRepo = repository;
  }

  /**
   * Retrieve an `Organization` by it's database id
   * @param organizationId The `DatabaseId` of the requested `Organization`
   * @returns Organization
   */
  public async getOrgById(organizationId: DatabaseId): Promise<Organization> {
    const orgOp = await this.orgRepo.getById(organizationId);
    if (orgOp.isEmpty())
      throw new DoesNotExistException('Organization does not exist');

    return orgOp.get();
  }

  /**
   * Fetch a list of all organizations
   * @returns A list of Organizations
   */
  public async getAll(): Promise<Organization[]> {
    return await this.orgRepo.getAll();
  }

  public async search(term: string): Promise<Organization[]> {
    return await this.orgRepo.search(term);
  }

  public async create(name: string): Promise<Organization> {
    const tempOrg: OrganizationData = { name: name, is_squelched: false };
    return await this.orgRepo.create(tempOrg);
  }

  public async rename(
    organizationId: DatabaseId,
    name: string
  ): Promise<Organization> {
    // Ensure organization exists
    const orgOp = await this.orgRepo.getById(organizationId);
    if (orgOp.isEmpty())
      throw new DoesNotExistException('Organization does not exist');

    const org = orgOp.get();
    org.name = name;
    const newOrg = await this.orgRepo.update(org);
    return newOrg;
  }

  public async squelch(organizationId: DatabaseId): Promise<Organization> {
    // Ensure organization exists
    const orgOp = await this.orgRepo.getById(organizationId);
    if (orgOp.isEmpty())
      throw new DoesNotExistException('Organization does not exist');

    const org = orgOp.get();
    org.is_squelched = true;
    const newOrg = await this.orgRepo.update(org);
    return newOrg;
  }
}
