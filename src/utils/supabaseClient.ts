
import { supabase as originalSupabase } from '@/integrations/supabase/client';
import { createTypedSupabaseClient } from './supabaseTypes';
import { createClient } from '@supabase/supabase-js';

// Get the original Supabase URL and key
const SUPABASE_URL = "https://gcqsxvkdizhelwcijuut.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjcXN4dmtkaXpoZWx3Y2lqdXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTI5OTQsImV4cCI6MjA1OTU4ODk5NH0.XwUzCZltDGfKqJg9wTVQARdh1ux6710pxUcdQVNiM3c";

// Create a new Supabase client with explicit auth configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

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
