// Blog Types

import { DatabaseId } from '~/shared/core/types';

export type BlogAuthorData = {
  firstname: string;
  lastname: string;
  website: string;
};

export interface BlogAuthor extends BlogAuthorData {
  id: DatabaseId;
}
