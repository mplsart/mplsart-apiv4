import { DoesNotExistException } from '../../../infrastructure/exceptions';
import { DatabaseId } from '~/shared/core/types';
import { Organization } from '../types';
import IOrgRepo from '../repos/IOrgRepo';

// Controller Types
// TODO: Do we need 'result' at this level?
type OrganizationResponse = Promise<{ result: Organization }>;
type OrganizationListResponse = Promise<{ result: Organization[] }>;

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
  public async getOrgById(organizationId: DatabaseId): OrganizationResponse {
    const orgOp = await this.orgRepo.getById(organizationId);
    if (orgOp.isEmpty())
      throw new DoesNotExistException('Organization does not exist');

    return { result: orgOp.get() };
  }

  public async getAll(): OrganizationListResponse {
    const orgs = await this.orgRepo.getAll();
    return { result: orgs };
  }

  public async search(term: string): OrganizationListResponse {
    const orgs = await this.orgRepo.search(term);
    return { result: orgs };
  }

  public async create(name: string): OrganizationResponse {
    const org = await this.orgRepo.create(name);
    return { result: org };
  }

  public async rename(
    organizationId: DatabaseId,
    name: string
  ): Promise<OrganizationResponse> {
    // Ensure organization exists
    const orgOp = await this.orgRepo.getById(organizationId);
    if (orgOp.isEmpty())
      throw new DoesNotExistException('Organization does not exist');

    const org = orgOp.get();
    org.name = name;
    const newOrg = await this.orgRepo.update(org);
    return { result: newOrg };
  }

  public async squelch(organizationId: DatabaseId): OrganizationResponse {
    // Ensure organization exists
    const orgOp = await this.orgRepo.getById(organizationId);
    if (orgOp.isEmpty())
      throw new DoesNotExistException('Organization does not exist');

    const org = orgOp.get();
    org.is_squelched = true;
    const newOrg = await this.orgRepo.update(org);
    return { result: newOrg };
  }
}
