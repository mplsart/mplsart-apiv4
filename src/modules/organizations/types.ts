// Organization
import { DatabaseId, DateStamp } from '~/shared/core/types';

export type OrganizationData = {
  name: string;
  is_squelched: boolean;
};

export interface Organization extends OrganizationData {
  id: DatabaseId;
  created_at: DateStamp;
  updated_at: DateStamp;
}
