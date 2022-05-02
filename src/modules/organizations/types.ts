// Organization
import { DatabaseId, DateStamp } from '~/shared/core/types';

export interface Organization {
  id?: DatabaseId;
  name: string;
  is_squelched: boolean;
  created_at: DateStamp;
  updated_at: DateStamp;
}
