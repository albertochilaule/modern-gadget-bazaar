
import { supabase as originalSupabase } from '@/integrations/supabase/client';
import { createTypedSupabaseClient } from './supabaseTypes';

// Create a typed version of the supabase client with auth configuration
export const supabase = createTypedSupabaseClient(originalSupabase);

// Configure Supabase auth for better session handling
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('SIGNED_IN event detected');
  } else if (event === 'SIGNED_OUT') {
    console.log('SIGNED_OUT event detected');
  } else if (event === 'USER_UPDATED') {
    console.log('USER_UPDATED event detected');
  } else if (event === 'PASSWORD_RECOVERY') {
    console.log('PASSWORD_RECOVERY event detected');
  }
});

// For debugging auth issues
console.log('Supabase client initialized with enhanced auth handling');
