'use client';

import { useState } from 'react';
import { supabase, signIn } from '@/lib/supabase';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult({ step: 'Test de connexion Supabase...' });

    try {
      // Test 1: Variables d'environnement
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setResult({ 
        step: 'Variables env',
        hasUrl,
        hasKey,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL 
      });

      if (!hasUrl || !hasKey) {
        setResult({ error: 'Variables d\'environnement manquantes' });
        setLoading(false);
        return;
      }

      // Test 2: Connexion
      const { data: loginData, error: loginError } = await signIn(
        'jeanmarie.jung@netcy.fr',
        'pAtHN7CGQ3J4tt5'
      );

      if (loginError) {
        setResult({ step: 'Erreur login', error: loginError.message, details: loginError });
        setLoading(false);
        return;
      }

      setResult({ step: 'Login OK', user: loginData.user?.id });

      // Test 3: Récupérer le profil client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', loginData.user?.id)
        .single();

      if (clientError) {
        setResult({ 
          step: 'Erreur récupération profil',
          error: clientError.message,
          code: clientError.code,
          details: clientError 
        });
        setLoading(false);
        return;
      }

      setResult({ 
        step: 'Profil récupéré',
        client: clientData,
        isAdmin: clientData?.role === 'admin'
      });

      // Test 4: Tester les permissions
      const { data: allClients, error: permError } = await supabase
        .from('clients')
        .select('*');

      if (permError) {
        setResult({ 
          step: 'Erreur permissions',
          error: permError.message,
          client: clientData
        });
      } else {
        setResult({ 
          step: '✅ TOUT FONCTIONNE',
          client: clientData,
          isAdmin: clientData?.role === 'admin',
          canAccessAllClients: allClients?.length > 0,
          totalClients: allClients?.length
        });
      }

    } catch (err: any) {
      setResult({ error: 'Exception', message: err.message, stack: err.stack });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110F1B] to-[#1a0f3a] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Test Supabase Admin</h1>

        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white px-6 py-3 rounded-lg font-semibold mb-8 disabled:opacity-50"
        >
          {loading ? 'Test en cours...' : 'Lancer le test'}
        </button>

        {result && (
          <div className="bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg p-6">
            <pre className="text-white text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-6">
          <h2 className="text-yellow-400 font-bold mb-2">⚠️ Informations</h2>
          <p className="text-yellow-200 text-sm">
            Cette page teste la connexion à Supabase et les permissions.
            <br />
            Email: jeanmarie.jung@netcy.fr
            <br />
            Si vous voyez "TOUT FONCTIONNE", le problème vient du dashboard.
            <br />
            Sinon, le message d'erreur indiquera exactement ce qui bloque.
          </p>
        </div>
      </div>
    </div>
  );
}
