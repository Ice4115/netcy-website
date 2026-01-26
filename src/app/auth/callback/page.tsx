'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken) {
          const { data: { session }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Error setting session:', error);
            router.push('/connexion?error=auth_failed');
            return;
          }

          if (session) {
            router.push('/client');
            return;
          }
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          router.push('/connexion?error=auth_failed');
          return;
        }

        if (session) {
          router.push('/client');
        } else {
          router.push('/connexion');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        router.push('/connexion?error=unexpected');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#110F1B] to-[#1a0f3a]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-white text-lg">Connexion en cours...</p>
      </div>
    </div>
  );
}
