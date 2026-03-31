'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X as XIcon, Camera, Check, Loader2, User, Phone, Mail, Building2, AlertCircle } from 'lucide-react';

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onAvatarChange?: (url: string) => void;
}

function FieldSkeleton() {
  return (
    <div className="h-11 bg-[#F3F4F5] rounded-xl animate-pulse" />
  );
}

export function ProfilePanel({ open, onClose, userId, onAvatarChange }: ProfilePanelProps) {
  const [nom,        setNom]        = useState('');
  const [prenom,     setPrenom]     = useState('');
  const [telephone,  setTelephone]  = useState('');
  const [email,      setEmail]      = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [avatarUrl,  setAvatarUrl]  = useState('');
  const [initials,   setInitials]   = useState('');
  const [saving,     setSaving]     = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const fileRef  = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Chargement des données depuis Supabase ── */
  useEffect(() => {
    if (!open || !userId) return;
    setLoading(true);
    setError('');

    (async () => {
      /* 1) Récupère la session pour avoir l'email Supabase Auth */
      const { data: { session } } = await supabase.auth.getSession();
      const authEmail = session?.user?.email ?? '';

      /* 2) Récupère le profil dans la table clients */
      const { data: cd, error: dbErr } = await supabase
        .from('clients')
        .select('nom, prenom, telephone, email, entreprise, avatar_url')
        .eq('id', userId)
        .single();

      if (dbErr && dbErr.code !== 'PGRST116') {
        /* PGRST116 = no rows found (pas d'erreur critique) */
        setError('Impossible de charger le profil. Vérifiez votre connexion.');
        setLoading(false);
        return;
      }

      if (cd) {
        setNom(cd.nom ?? '');
        setPrenom(cd.prenom ?? '');
        setTelephone(cd.telephone ?? '');
        /* Email : priorité à la table clients, fallback Auth */
        setEmail(cd.email ?? authEmail);
        setEntreprise(cd.entreprise ?? '');
        setAvatarUrl(cd.avatar_url ?? '');

        const first  = (cd.prenom ?? cd.nom ?? authEmail ?? '?')[0];
        const second = (cd.nom ?? authEmail ?? '?')[0];
        setInitials(`${first}${second}`.toUpperCase());
      } else {
        /* Ligne absente dans clients — on utilise Auth uniquement */
        setEmail(authEmail);
        setInitials(authEmail.slice(0, 2).toUpperCase());
      }

      setLoading(false);
    })();
  }, [open, userId]);

  /* ── Fermer sur clic extérieur ── */
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, onClose]);

  /* ── Touche Échap ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  /* ── Upload avatar → Supabase Storage ── */
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const maxMb = 5;
    if (file.size > maxMb * 1024 * 1024) {
      setError(`La photo ne doit pas dépasser ${maxMb} Mo.`);
      return;
    }

    setUploading(true);
    setError('');

    const ext  = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/avatar.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (upErr) {
      setError('Échec du téléversement. Réessayez.');
    } else {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      const bust = `${publicUrl}?t=${Date.now()}`;
      setAvatarUrl(bust);
      await supabase.from('clients').update({ avatar_url: bust }).eq('id', userId);
      onAvatarChange?.(bust);
    }

    setUploading(false);
  };

  /* ── Sauvegarde du profil ── */
  const save = async () => {
    if (!userId) return;
    setSaving(true);
    setError('');

    const { error: saveErr } = await supabase
      .from('clients')
      .update({ nom, prenom, telephone, entreprise })
      .eq('id', userId);

    if (saveErr) {
      setError('Erreur lors de la sauvegarde. Réessayez.');
    } else {
      const first  = (prenom || nom || '?')[0];
      const second = (nom || '?')[0];
      setInitials(`${first}${second}`.toUpperCase());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40" />

      {/* Panneau */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
        style={{ animation: 'slideInRight 0.25s cubic-bezier(0.05,0.7,0.1,1) both' }}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F5]">
          <div>
            <h2 className="font-display font-bold text-lg text-[#191C1D]">Mon profil</h2>
            <p className="text-xs text-[#73777F] mt-0.5">
              {loading ? 'Chargement…' : email || 'Gérez vos informations'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F3F4F5] transition-colors"
          >
            <XIcon size={16} className="text-[#73777F]" />
          </button>
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Message d'erreur */}
          {error && (
            <div className="flex items-start gap-2 bg-[#FEE2E2] text-[#BF3003] rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            {loading ? (
              <div className="w-24 h-24 rounded-full bg-[#F3F4F5] animate-pulse" />
            ) : (
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#0052FF] flex items-center justify-center ring-4 ring-[#EEF2FF]">
                  {avatarUrl
                    ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    : <span className="text-white font-display font-bold text-2xl">{initials}</span>
                  }
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {uploading
                    ? <Loader2 size={20} className="text-white animate-spin" />
                    : <Camera size={20} className="text-white" />
                  }
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            )}
            {!loading && (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="text-xs text-[#0052FF] hover:text-[#003EC7] font-medium transition-colors flex items-center gap-1"
              >
                <Camera size={12} />
                {uploading ? 'Téléversement…' : 'Changer la photo'}
              </button>
            )}
          </div>

          {/* Champs */}
          <div className="space-y-4">
            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#44474E] uppercase tracking-wider">Prénom</label>
                {loading ? <FieldSkeleton /> : (
                  <div className="flex items-center gap-2 bg-[#F3F4F5] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#0052FF]/30 transition-all">
                    <User size={14} className="text-[#C3C6CF] flex-shrink-0" />
                    <input
                      value={prenom}
                      onChange={e => setPrenom(e.target.value)}
                      placeholder="Prénom"
                      className="flex-1 bg-transparent text-[#191C1D] text-sm focus:outline-none placeholder-[#C3C6CF] min-w-0"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#44474E] uppercase tracking-wider">Nom</label>
                {loading ? <FieldSkeleton /> : (
                  <div className="flex items-center gap-2 bg-[#F3F4F5] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#0052FF]/30 transition-all">
                    <User size={14} className="text-[#C3C6CF] flex-shrink-0" />
                    <input
                      value={nom}
                      onChange={e => setNom(e.target.value)}
                      placeholder="Nom"
                      className="flex-1 bg-transparent text-[#191C1D] text-sm focus:outline-none placeholder-[#C3C6CF] min-w-0"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Email (lecture seule) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#44474E] uppercase tracking-wider">Email</label>
              {loading ? <FieldSkeleton /> : (
                <div className="flex items-center gap-2 bg-[#F3F4F5] rounded-xl px-3 py-2.5 opacity-60">
                  <Mail size={14} className="text-[#C3C6CF] flex-shrink-0" />
                  <input
                    value={email}
                    disabled
                    className="flex-1 bg-transparent text-[#191C1D] text-sm focus:outline-none cursor-not-allowed min-w-0 truncate"
                  />
                </div>
              )}
              <p className="text-[10px] text-[#C3C6CF] uppercase tracking-wider">
                Modifiable depuis les paramètres de sécurité
              </p>
            </div>

            {/* Téléphone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#44474E] uppercase tracking-wider">Téléphone</label>
              {loading ? <FieldSkeleton /> : (
                <div className="flex items-center gap-2 bg-[#F3F4F5] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#0052FF]/30 transition-all">
                  <Phone size={14} className="text-[#C3C6CF] flex-shrink-0" />
                  <input
                    value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="flex-1 bg-transparent text-[#191C1D] text-sm focus:outline-none placeholder-[#C3C6CF] min-w-0"
                  />
                </div>
              )}
            </div>

            {/* Entreprise */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#44474E] uppercase tracking-wider">Entreprise</label>
              {loading ? <FieldSkeleton /> : (
                <div className="flex items-center gap-2 bg-[#F3F4F5] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#0052FF]/30 transition-all">
                  <Building2 size={14} className="text-[#C3C6CF] flex-shrink-0" />
                  <input
                    value={entreprise}
                    onChange={e => setEntreprise(e.target.value)}
                    placeholder="Votre entreprise (facultatif)"
                    className="flex-1 bg-transparent text-[#191C1D] text-sm focus:outline-none placeholder-[#C3C6CF] min-w-0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bloc info */}
          {!loading && (
            <div className="bg-[#F3F4F5] rounded-2xl p-4">
              <p className="text-xs text-[#73777F] leading-relaxed">
                Vos informations sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers.
              </p>
            </div>
          )}
        </div>

        {/* Pied de page — bouton Enregistrer */}
        {!loading && (
          <div className="border-t border-[#F3F4F5] p-5 space-y-2">
            <button
              onClick={save}
              disabled={saving}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <><Loader2 size={14} className="animate-spin" /> Enregistrement…</>
              ) : saved ? (
                <><Check size={14} /> Enregistré !</>
              ) : (
                'Enregistrer les modifications'
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
