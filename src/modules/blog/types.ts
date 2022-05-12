// Blog Types

import { DatabaseId, IResource } from '~/shared/core/types';

export type BlogAuthorData = {
  firstname: string;
  lastname: string;
  website: string;
};

export interface BlogAuthor extends BlogAuthorData, IResource {
  id: DatabaseId;
}
