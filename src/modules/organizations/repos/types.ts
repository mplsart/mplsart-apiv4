// Database Types
import { DatabaseId, DateStamp } from '~/shared/core/types';

export type OrganizationRecord = {
  id: DatabaseId;
  name: string;
  is_squelched: boolean;
  created_at: DateStamp;
  updated_at: DateStamp;
};

export type OrganizationMembership = {
  id: DatabaseId;
  organization_id: DatabaseId;
  user_id: DatabaseId;
  created_at: DateStamp;
  updated_at: DateStamp;
  // OrganizationRecord
  // UserRecord
};

export type OrganizationRoles = {
  id: DatabaseId;
  name: string;
  organization_id: DatabaseId;
};

export type OrganizationMembershipRoles = {
  id: DatabaseId;
  org_membership_id: DatabaseId;
  org_role_id: DatabaseId;
  is_squelched: DatabaseId;
  created_at: DateStamp;
  updated_at: DateStamp;
};
