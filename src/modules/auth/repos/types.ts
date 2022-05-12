// Database Types
import { DatabaseId, DateStamp } from '~/shared/core/types';

export type UserRecord = {
  id: DatabaseId;
  auth_id?: DatabaseId;
  name: string;
  primary_email?: string;
  username?: string;
  avatar_url?: string;
  is_support: boolean;
  is_initialized: boolean;
  is_squelched: boolean;
  created_at: DateStamp;
  updated_at: DateStamp;
};
