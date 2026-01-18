import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email: string, password: string, additionalData?: any) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.netcy.fr';
  
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/connexion`,
      data: {
        email: email
      }
    }
  });

  if (result.data.user && additionalData) {
    const clientData = {
      email: email,
      ...additionalData
    };

    const { error: rpcError } = await supabase.rpc('create_client_profile', {
      user_id: result.data.user.id,
      client_data: clientData
    });

    if (rpcError) {
      return { ...result, error: rpcError };
    }
  }

  return result;
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
