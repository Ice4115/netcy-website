import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email: string, password: string, additionalData?: any) => {
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/connexion`,
      data: {
        email: email
      }
    }
  });

  if (result.data.user) {
    const clientRecord = {
      id: result.data.user.id,
      email: email,
      role: 'client',
      ...additionalData
    };

    const { error: insertError } = await supabase
      .from('clients')
      .insert(clientRecord);

    if (insertError) {
      console.error('Erreur insertion client:', insertError);
      return { ...result, error: insertError };
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
