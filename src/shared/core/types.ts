// Shared Types
export type DatabaseId = string;
export type DateStamp = string;

// Legacy Datastore things
export type RESOURCE_ID = string;

export interface IResource {
  _meta: {
    is_verbose: boolean;
    resource_type: string;
    resource_id: RESOURCE_ID;
  };
}
