
import { supabase as originalSupabase } from '@/integrations/supabase/client';
import { createTypedSupabaseClient } from './supabaseTypes';

// Create a typed version of the supabase client with auth configuration
export const supabase = createTypedSupabaseClient(originalSupabase);

// Enhanced console logging for easier debugging
const logAuthEvent = (event: string) => {
  console.log(`Auth event: ${event} at ${new Date().toLocaleTimeString()}`);
};

// Configure Supabase auth for better session handling
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    logAuthEvent('SIGNED_IN');
    console.log('User ID:', session?.user?.id);
  } else if (event === 'SIGNED_OUT') {
    logAuthEvent('SIGNED_OUT');
  } else if (event === 'USER_UPDATED') {
    logAuthEvent('USER_UPDATED');
  } else if (event === 'PASSWORD_RECOVERY') {
    logAuthEvent('PASSWORD_RECOVERY');
  } else if (event === 'TOKEN_REFRESHED') {
    logAuthEvent('TOKEN_REFRESHED');
  }
});

// For debugging auth issues
console.log('Supabase client initialized with enhanced auth handling and logging');
