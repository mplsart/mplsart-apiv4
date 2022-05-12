import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export default createClient(
  SUPABASE_URL as string,
  SUPABASE_ANON_KEY as string
);
