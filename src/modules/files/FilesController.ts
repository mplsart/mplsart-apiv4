// Files Controller
import { DoesNotExistException } from '~/infrastructure/exceptions';
import { PaginatedResult } from '~/infrastructure/types';

import { DatabaseId } from '~/shared/core/types';
import { FileListParamsType } from './types';
import { FileContainer } from './types';
import { FileContainerData } from './types';
import IFilesRepo from './repos/IFilesRepo';

export default class FilesController {
  private filesRepo: IFilesRepo;

  constructor(filesRepo: IFilesRepo) {
    this.filesRepo = filesRepo;
  }

  //////////////////////////////////////////////////////////////////////////////
  // FileContainer
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Retrieve an `FileContainer` by its datastore resource id
   * @param resourceId The `RESOURCE_ID` of the requested `FileContainer`
   * @returns FileContainer
   */

  public async getByResourceId(resourceId: string): Promise<FileContainer> {
    const op = await this.filesRepo.getById(resourceId);
    if (op.isEmpty()) throw new DoesNotExistException('File does not exist');
    return op.get();
  }

  /**
   * Fetch a list of all FileContainers
   * @returns A list of FileContainer Models
   */
  public async getAll(
    params: FileListParamsType
  ): Promise<PaginatedResult<FileContainer>> {
    return await this.filesRepo.getAll(params);
  }

  /**
   * Create a new FileContainer record
   * @param params Data for new FileContainer Record
   * @returns Hydrated FileContainer record
   */
  public async create(params: FileContainerData): Promise<FileContainer> {
    return await this.filesRepo.create(params);
  }

  /**
   * Update data about an FileContainer
   * @param fileId Database Id of the FileContainer to update
   * @param params Data for new FileContainer Record
   * @returns Hydrated FileContainer record
   */
  public async update(
    fileId: DatabaseId,
    params: FileContainerData
  ): Promise<FileContainer> {
    // Ensure exists
    const op = await this.filesRepo.getById(fileId);
    if (op.isEmpty())
      throw new DoesNotExistException('FileContainer does not exist');

    // Update fields
    const model = op.get();
    model.caption = params.caption;

    // Persist
    return await this.filesRepo.update(model);
  }
}
