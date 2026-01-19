'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser, signOut } from '@/lib/supabase';
import { Bell } from '@/components/animate-ui/icons/bell';
import { Lock } from '@/components/animate-ui/icons/lock';
import { User } from '@/components/animate-ui/icons/user';
import { LogOut } from '@/components/animate-ui/icons/log-out';
import { Save } from '@/components/animate-ui/icons/save';
import { Eye } from '@/components/animate-ui/icons/eye';
import { EyeOff } from '@/components/animate-ui/icons/eye-off';

interface ClientData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  entreprise?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    entreprise: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchClientData = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setClientData(data);
      setFormData({
        nom: data.nom || '',
        prenom: data.prenom || '',
        telephone: data.telephone || '',
        entreprise: data.entreprise || ''
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientData) return;

    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from('clients')
      .update({
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        entreprise: formData.entreprise
      })
      .eq('id', clientData.id);

    if (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    } else {
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      fetchClientData();
    }

    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword
    });

    if (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du mot de passe' });
    } else {
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }

    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/connexion');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] bg-clip-text text-transparent">Paramètres</span>
          </h1>
          <p className="text-gray-400 text-lg">Gérez vos préférences et votre compte</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-400/10 border-green-400/30 text-green-400' 
              : 'bg-red-400/10 border-red-400/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-[#8FA5FF]" size={24} animate={true} loop={true} loopDelay={2000} />
              <h2 className="text-2xl font-bold text-white">Informations Personnelles</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Nom</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 bg-[#060010] border border-[#392e4e] rounded-lg text-white focus:border-[#6F3FFF] focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-3 bg-[#060010] border border-[#392e4e] rounded-lg text-white focus:border-[#6F3FFF] focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#060010] border border-[#392e4e] rounded-lg text-white focus:border-[#6F3FFF] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Entreprise</label>
                <input
                  type="text"
                  value={formData.entreprise}
                  onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                  className="w-full px-4 py-3 bg-[#060010] border border-[#392e4e] rounded-lg text-white focus:border-[#6F3FFF] focus:outline-none transition"
                  placeholder="Particulier si non renseigné"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg font-semibold hover:from-[#7A4FFF] hover:to-[#8A9FFF] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} animate={true} loop={true} loopDelay={2000} />
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </form>
          </div>

          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-[#8FA5FF]" size={24} animate={true} loop={true} loopDelay={2000} />
              <h2 className="text-2xl font-bold text-white">Sécurité</h2>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 bg-[#060010] border border-[#392e4e] rounded-lg text-white focus:border-[#6F3FFF] focus:outline-none transition"
                    placeholder="Minimum 6 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showPasswords.new ? <EyeOff size={20} animate={true} loop={true} loopDelay={2000} /> : <Eye size={20} animate={true} loop={true} loopDelay={2000} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 bg-[#060010] border border-[#392e4e] rounded-lg text-white focus:border-[#6F3FFF] focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} animate={true} loop={true} loopDelay={2000} /> : <Eye size={20} animate={true} loop={true} loopDelay={2000} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !passwordData.newPassword || !passwordData.confirmPassword}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg font-semibold hover:from-[#7A4FFF] hover:to-[#8A9FFF] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock size={20} animate={true} loop={true} loopDelay={2000} />
                {saving ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </form>
          </div>

          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-red-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <LogOut className="text-red-400" size={24} animate={true} loop={true} loopDelay={2000} />
              <h2 className="text-2xl font-bold text-white">Déconnexion</h2>
            </div>

            <p className="text-gray-400 mb-6">
              Vous serez redirigé vers la page de connexion
            </p>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition border border-red-500/50"
            >
              <LogOut size={20} animate={true} loop={true} loopDelay={2000} />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
