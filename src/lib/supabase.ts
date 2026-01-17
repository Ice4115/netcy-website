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

  if (result.data.user && additionalData) {
    let retries = 0;
    const maxRetries = 5;
    
    while (retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('id', result.data.user.id)
        .single();
      
      if (existingClient) {
        const { error: updateError } = await supabase
          .from('clients')
          .update(additionalData)
          .eq('id', result.data.user.id);

        if (updateError) {
          console.error('Erreur mise à jour client:', updateError);
          return { ...result, error: updateError };
        }
        break;
      }
      
      retries++;
    }
    
    if (retries === maxRetries) {
      console.error('Le profil client n\'a pas été créé par le trigger');
      return { ...result, error: { message: 'Erreur création profil' } };
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
