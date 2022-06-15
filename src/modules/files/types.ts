// Files Types
import { z } from 'zod';
import { DatabaseId, IResource } from '~/shared/core/types';

export enum VersionKeys {
  CARD_LARGE = 'CARD_LARGE',
  CARD_PROGRESSIVE = 'CARD_PROGRESSIVE',
  CARD_SMALL = 'CARD_SMALL',
  FULL = 'FULL',
  THUMB = 'THUMB',
  SIZED = 'SIZED'
}

// export const versionMap: Record<keyof VERSIONS, {
//     FULL = {'key': 'FULL', 'height': 1500, 'width': 1500} # Width is max dimension
//     SIZED = {'key': 'SIZED', 'height': 900, 'width': 900} # Scaled to max dimension
//     CARD_LARGE = {'key': 'CARD_LARGE', 'height': 472, 'width': 900} # Cropped to this size
//     CARD_SMALL = {'key': 'CARD_SMALL', 'height': 184, 'width': 350} # Cropped to this size
//     THUMB = {'key': 'THUMB', 'height': 160, 'width': 160} # Cropped to this size
//     CARD_PROGRESSIVE = {'key': 'CARD_PROGRESSIVE', 'height': 21, 'width': 40} # Cropped to this size
// }

export interface VersionData {
  url: string;
  width: number;
  height: number;
}

export interface VersionSet {
  [VersionKeys.CARD_LARGE]: VersionData | '';
  [VersionKeys.CARD_PROGRESSIVE]: VersionData | '';
  [VersionKeys.CARD_SMALL]: VersionData | '';
  [VersionKeys.FULL]: VersionData | '';
  [VersionKeys.THUMB]: VersionData | '';
  [VersionKeys.SIZED]: VersionData | '';
}

// File Container
export type FileContainerData = {
  caption: string;
  created_date: string;
  modified_date: string;
};

// Is this used?
export interface FileContainer extends FileContainerData, IResource {
  id: DatabaseId;
  versions: VersionSet;
}

export const FileListParams = z.object({
  limit: z.preprocess((val) => (val ? Number(val) : 100), z.number()),
  order: z.preprocess((val) => (val ? val : 'modified_date'), z.string()),
  cursor: z.string().optional()
});

export type FileListParamsType = z.infer<typeof FileListParams>;
