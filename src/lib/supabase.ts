import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const customStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    const inSession = sessionStorage.getItem(key) !== null;
    if (inSession) {
      sessionStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

export const signUp = async (email: string, password: string, additionalData?: any) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.netcy.fr';
  
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
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

export const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
  // Si rememberMe = false, on supprime le token localStorage avant de se connecter
  if (typeof window !== 'undefined' && !rememberMe) {
    const storageKey = `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`;
    localStorage.removeItem(storageKey);
  }

  // On utilise le client partagé pour éviter les fuites de session
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return result;
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signInWithGoogle = async () => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.netcy.fr';
  
  const result = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return result;
};
