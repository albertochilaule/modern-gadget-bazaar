
import { supabase } from '@/utils/supabaseClient';

export interface UserProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export const updateUserProfile = async (userId: string, userData: UserProfileData) => {
  try {
    // First update the auth user if email is changing
    if (userData.email) {
      const { error: authError } = await supabase.auth.updateUser({
        email: userData.email
      });
      
      if (authError) throw authError;
    }
    
    // Then update the profile in the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: userData.name,
        email: userData.email,
        // We're storing phone in profile data
        // Add any additional fields as needed
      })
      .eq('id', userId)
      .select('*')
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      phone: userData.phone // Add phone to the returned data
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
