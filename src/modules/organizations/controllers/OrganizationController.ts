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
    const org = await orgRepo.getById(organizationId);
    return { result: org };
  }

  public async getAll(): Promise<OrganizationListResponse> {
    // TODO: Don't ? go directly to the repository...
    const orgRepo = new SupaOrgRepo();
    const org = await orgRepo.getAll();
    return { result: org };
  }
}
