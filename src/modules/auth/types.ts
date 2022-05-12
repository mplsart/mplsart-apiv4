// Auth Types
import { DatabaseId, DateStamp } from '../../shared/core/types';

export type UserData = {
  name: string;
  auth_id?: DatabaseId;
  primary_email?: string;
  username?: string;
  avatar_url?: string;
  is_support: boolean;
  is_initialized: boolean;
  is_squelched: boolean;
};

export interface User extends UserData {
  id: DatabaseId;
  created_at: DateStamp;
  updated_at: DateStamp;
}
