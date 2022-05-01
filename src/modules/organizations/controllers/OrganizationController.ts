import { DatabaseId } from '~/shared/core/types';
import SupaOrgRepo from '../repos/SupaOrgRepo';
import { Organization } from '../types';

interface OrganizationResponse {
  result: Organization;
}

interface OrganizationListResponse {
  result: Organization[];
}

export default class OrganizationsController {
  /**
   * Retrieve an `Organization` by it's database id
   * @param organizationId The `DatabaseId` of the requested `Organization`
   * @returns Organization
   */
  public async getOrgById(
    organizationId: DatabaseId
  ): Promise<OrganizationResponse> {
    // TODO: Don't ? go directly to the repository...
    const orgRepo = new SupaOrgRepo();
    const orgOp = await orgRepo.getById(organizationId);
    return { result: orgOp.get() };
  }

  public async getAll(): Promise<OrganizationListResponse> {
    // TODO: Don't ? go directly to the repository...
    const orgRepo = new SupaOrgRepo();
    const orgs = await orgRepo.getAll();
    return { result: orgs };
  }

  public async search(term: string): Promise<OrganizationListResponse> {
    // TODO: Don't ? go directly to the repository...
    const orgRepo = new SupaOrgRepo();
    const orgs = await orgRepo.search(term);
    return { result: orgs };
  }

  public async create(name: string): Promise<OrganizationResponse> {
    const orgRepo = new SupaOrgRepo();
    const org = await orgRepo.create(name);
    return { result: org };
  }
}
