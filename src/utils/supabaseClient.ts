
import { supabase as originalSupabase } from '@/integrations/supabase/client';
import { createTypedSupabaseClient } from './supabaseTypes';

// Create a typed version of the supabase client
export const supabase = createTypedSupabaseClient(originalSupabase);
