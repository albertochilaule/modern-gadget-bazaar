
import { supabase } from '@/utils/supabaseClient';

export const updateUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Supabase requires the current session to update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};
