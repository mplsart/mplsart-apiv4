// Generic Files Repo Interface
import { FileListParamsType, FileContainer, FileContainerData } from '../types';
import { Optional } from 'typescript-optional';
import { PaginatedResult } from '~/infrastructure/types';

export default interface IBlogAuthorRepo {
  getAll(params: FileListParamsType): Promise<PaginatedResult<FileContainer>>;
  getById(id: string): Promise<Optional<FileContainer>>;
  create(data: FileContainerData): Promise<FileContainer>;
  update(m: FileContainer): Promise<FileContainer>;
}
