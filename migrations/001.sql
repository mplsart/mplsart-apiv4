DROP TABLE IF EXISTS "OrganizationMembershipRoles";
DROP TABLE IF EXISTS "OrganizationMembership";
DROP TABLE IF EXISTS "OrganizationRoles";
DROP TABLE IF EXISTS "User";
DROP TABLE IF EXISTS "Organization";

/* Create Organization Table */
CREATE TABLE "Organization" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  is_squelched boolean DEFAULT FALSE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE "Organization" is 'Top Level Organizations';

/* Create User Table */
Create TABLE "User" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  is_support boolean DEFAULT FALSE,
  is_squelched boolean DEFAULT FALSE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

/* Create Some Core Organizations */
COMMENT ON TABLE "User" is 'System Users';

INSERT INTO "Organization" (id, is_squelched, name) 
VALUES 
('5586d8db-340e-49b7-b22a-9ca26fa2b4b9', FALSE, 'MPLSART.COM'), 
('4720e352-9dd2-4b27-8292-3cbf8d50b3a5', FALSE, 'Gamut'), 
('7500c9e7-90b7-477c-9b27-bbb9eecc2410', FALSE, 'Emerging Curators Institute'),
('df43fdcf-c57a-4b45-b7d6-8b19e25d57c9', TRUE, 'White Page');

/* Create Some Core Users */
INSERT INTO "User" (id, name, is_support) 
VALUES 
('a38029ac-6c22-4de0-aed3-ecb40288d87d', 'Blaine Garrett', FALSE), 
('c37c474b-943b-46a5-9d6d-509393fa49cb', 'Katie Garrett', FALSE), 
('2f2cee3d-43a0-459c-8f34-e029661a47ab', 'Russ White', FALSE), 
('b3fb0cff-2021-4cf7-8d09-8a7407a84084', 'Cassie Garner', FALSE), 
('f70275c0-901f-446b-8851-7fb50d4c2cda', 'Nicole Thomas', FALSE),
('ec9bfbef-d02c-4aaf-bb1d-e74134ba976d', 'Anika Seih', TRUE);

/* Create Org Memberships Table */
Create TABLE "OrganizationMembership" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES "Organization" (id),
  user_id uuid NOT NULL REFERENCES "User" (id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(organization_id, user_id)
);

/* Create Some Memberships */
INSERT INTO "OrganizationMembership" (id, organization_id, user_id)
VALUES 
-- MPLSART 
('75016c9c-2aca-4495-8f13-19492564a9da', '5586d8db-340e-49b7-b22a-9ca26fa2b4b9', 'a38029ac-6c22-4de0-aed3-ecb40288d87d'), -- Blaine
('2df783ce-f9fa-4cf0-88a5-c18c0f7ac569', '5586d8db-340e-49b7-b22a-9ca26fa2b4b9', '2f2cee3d-43a0-459c-8f34-e029661a47ab'), -- Russ
('c7fbbd1e-9d9f-4c64-ba34-8cb2fe255a59', '5586d8db-340e-49b7-b22a-9ca26fa2b4b9', 'f70275c0-901f-446b-8851-7fb50d4c2cda'), -- Nicole
('8d677d19-f9c2-453e-9914-6ea4423d8907', '5586d8db-340e-49b7-b22a-9ca26fa2b4b9', 'c37c474b-943b-46a5-9d6d-509393fa49cb'), -- Katie

-- Gamut
('f568f28e-c8be-46f6-8f50-11998a9e9fbb', '4720e352-9dd2-4b27-8292-3cbf8d50b3a5', 'b3fb0cff-2021-4cf7-8d09-8a7407a84084'), -- Cassie
('a3396d05-8b3c-481b-b8a7-c12b41b84bf0', '4720e352-9dd2-4b27-8292-3cbf8d50b3a5', 'c37c474b-943b-46a5-9d6d-509393fa49cb'), -- Katie

-- ECI 
('8805a4cb-b295-4de1-a9dd-c792a188b9c2', '7500c9e7-90b7-477c-9b27-bbb9eecc2410', 'f70275c0-901f-446b-8851-7fb50d4c2cda'), -- Nicole
('4f3387c0-9c8a-4b76-9ee4-6f3754f661b9', '7500c9e7-90b7-477c-9b27-bbb9eecc2410', '2f2cee3d-43a0-459c-8f34-e029661a47ab'), -- Russ
('bbcf6479-245d-42cc-8d5a-7187e6c80a4e', '7500c9e7-90b7-477c-9b27-bbb9eecc2410', 'a38029ac-6c22-4de0-aed3-ecb40288d87d'); -- Blaine

/*  Organization Roles */
Create TABLE "OrganizationRole" (
  id BIGSERIAL PRIMARY KEY,
  name text,
  organization_id uuid REFERENCES "Organization" (id),
  UNIQUE(organization_id, name)
);

INSERT INTO "OrganizationRole" (id, name, organization_id)
VALUES 
-- system roles
(1, 'Member', null),
(2, 'Admin', null);

/*  Organization Roles */
Create TABLE "OrganizationMembershipRole" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_membership_id uuid REFERENCES "OrganizationMembership" (id),
  org_role_id BIGSERIAL REFERENCES "OrganizationRole" (id),
  is_squelched boolean DEFAULT FALSE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(org_membership_id, org_role_id)
);

INSERT INTO "OrganizationMembershipRole" (org_membership_id, org_role_id)
VALUES 

('75016c9c-2aca-4495-8f13-19492564a9da', 2), -- Blaine is Org admin of MPLSART
('2df783ce-f9fa-4cf0-88a5-c18c0f7ac569', 1), -- Russ is Org member of MPLSART
('f568f28e-c8be-46f6-8f50-11998a9e9fbb', 2); -- Cassie is Org Admin of Gamut


  
-- SELECT 
--   m.id as "m_id",
--   u.name as "u_name", 
--   u.id as "u_id", 
--   o.name as "o_name", 
--   o.id as "o_id" 

-- FROM "OrganizationMembership" as m
-- LEFT JOIN "Organization" as o ON m.organization_id = o.id
-- LEFT JOIN "User" as u ON m.user_id = u.id
-- ORDER BY o.name, u.name;


-- SELECT 
--   o.name as "org",
--   u.name as "user",
--   r.name
-- FROM "OrganizationMembership" as m
-- LEFT JOIN "Organization" as o ON m.organization_id = o.id
-- LEFT JOIN "User" as u ON m.user_id = u.id
-- LEFT JOIN "OrganizationMembershipRoles" as omr on omr.org_membership_id = m.id
-- LEFT JOIN "OrganizationRoles" r on omr.org_role_id = r.id
-- WHERE r.id IS NOT NULL
-- ORDER BY o.name, u.name;