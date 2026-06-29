"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavLink from '@/components/NavLink';
import { User, Mail, Lock, Eye, EyeOff, Check, Building2, Users } from 'lucide-react';
import { signUp, getCurrentUser } from '@/lib/supabase';
import { Checkbox } from '@/components/animate-ui/components/radix/checkbox';
import { Label } from '@/components/ui/label';

/* ── Formatters ── */
function formatPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 10);
  const parts: string[] = [];
  for (let i = 0; i < d.length; i += 2) parts.push(d.slice(i, i + 2));
  return parts.join(' ');
}

function formatSiret(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 14);
  const parts: string[] = [];
  if (d.length > 0) parts.push(d.slice(0, 3));
  if (d.length > 3) parts.push(d.slice(3, 6));
  if (d.length > 6) parts.push(d.slice(6, 9));
  if (d.length > 9) parts.push(d.slice(9, 14));
  return parts.join(' ');
}

/* ── Mini stepper indicator ── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const done = i + 1 < current;
        const active = i + 1 === current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center rounded-full transition-all duration-300 font-semibold text-xs
                ${done ? 'w-7 h-7 bg-[#0052FF] text-white' :
                  active ? 'w-7 h-7 bg-on-surface text-surface' :
                    'w-7 h-7 bg-surface-container text-outline'}`}
            >
              {done ? <Check size={12} strokeWidth={2.5} /> : i + 1}
            </div>
            {i < total - 1 && (
              <div className={`h-px w-8 transition-all duration-300 ${done ? 'bg-[#0052FF]' : 'bg-surface-container'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Field ── */
function Field({
  label, type = 'text', value, onChange, placeholder, icon, required = false,
  rightElement, hint,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  icon?: React.ReactNode; required?: boolean;
  rightElement?: React.ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#0052FF]/30 transition-all">
        {icon && <span className="text-outline-variant">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-on-surface text-sm placeholder:text-outline-variant focus:outline-none"
        />
        {rightElement}
      </div>
      {hint && <p className="text-[10px] text-outline uppercase tracking-wider">{hint}</p>}
    </div>
  );
}

/* ── Password strength bar ── */
function StrengthBar({ strength }: { strength: number }) {
  const color = strength >= 80 ? '#166534' : strength >= 50 ? '#854D0E' : '#BF3003';
  const label = strength >= 80 ? 'Fort' : strength >= 50 ? 'Moyen' : 'Faible';
  return (
    <div className="space-y-1">
      <div className="h-1 bg-surface-container rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${strength}%`, backgroundColor: color }} />
      </div>
      {strength > 0 && <p className="text-[10px]" style={{ color }}>{label}</p>}
    </div>
  );
}

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Form state
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [adresse, setAdresse] = useState('');
  const [adresseLigne2, setAdresseLigne2] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [pays, setPays] = useState('France');
  const [telephone, setTelephone] = useState('');
  const [type, setType] = useState<'particulier' | 'entreprise' | 'entreprise_creation' | 'association'>('particulier');
  const [nomSociete, setNomSociete] = useState('');
  const [siret, setSiret] = useState('');
  const [nomAssociation, setNomAssociation] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    getCurrentUser().then((user) => { if (user) router.push('/client'); });
  }, [router]);

  useEffect(() => {
    let s = 0;
    if (password.length >= 8) s += 25;
    if (password.length >= 12) s += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) s += 20;
    if (/\d/.test(password)) s += 15;
    if (/[^a-zA-Z0-9]/.test(password)) s += 15;
    setPasswordStrength(s);
  }, [password]);

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (nom.trim().length < 2) { setError('Nom trop court'); return false; }
      if (prenom.trim().length < 2) { setError('Prénom trop court'); return false; }
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setError('Email invalide'); return false; }
      return true;
    }
    if (step === 2) {
      if (password.length < 12) { setError('Minimum 12 caractères'); return false; }
      if (!/[A-Z]/.test(password)) { setError('Au moins une majuscule requise'); return false; }
      if (!/[a-z]/.test(password)) { setError('Au moins une minuscule requise'); return false; }
      if (!/\d/.test(password)) { setError('Au moins un chiffre requis'); return false; }
      if (!/[^a-zA-Z0-9]/.test(password)) { setError('Au moins un caractère spécial requis'); return false; }
      if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas'); return false; }
      return true;
    }
    if (step === 3) {
      if (!adresse.trim()) { setError('Adresse requise'); return false; }
      if (!codePostal.match(/^\d{5}$/)) { setError('Code postal invalide (5 chiffres)'); return false; }
      if (!telephone.match(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)) {
        setError('Format téléphone invalide (ex : 06 12 34 56 78)'); return false;
      }
      if ((type === 'entreprise' || type === 'entreprise_creation') && !nomSociete.trim()) {
        setError('Nom de société requis'); return false;
      }
      if (type === 'entreprise' && !siret.replace(/\s/g, '').match(/^\d{14}$/)) {
        setError('SIRET invalide (14 chiffres)'); return false;
      }
      if (type === 'association' && !nomAssociation.trim()) {
        setError('Nom d\'association requis'); return false;
      }
      if (!acceptTerms) { setError('Vous devez accepter les conditions'); return false; }
      return true;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const clientData: Record<string, string | null> = {
        nom, prenom, adresse,
        adresse_ligne2: adresseLigne2 || null,
        code_postal: codePostal,
        pays,
        telephone: telephone.replace(/\s/g, ''),
        type,
        entreprise: type === 'entreprise' || type === 'entreprise_creation'
          ? nomSociete
          : type === 'association' ? nomAssociation : 'Particulier',
      };
      if (type === 'entreprise' || type === 'entreprise_creation') clientData.nom_societe = nomSociete;
      if (type === 'entreprise') clientData.siret = siret.replace(/\s/g, '');
      if (type === 'association') clientData.nom_association = nomAssociation;

      const { data, error: signUpError } = await signUp(email, password, clientData);
      if (signUpError) {
        setError(signUpError.message.includes('already registered') ? 'Email déjà utilisé' : 'Erreur lors de l\'inscription');
        setLoading(false);
        return;
      }
      if (data.user) router.push(`/inscription/verification?email=${encodeURIComponent(email)}`);
    } catch {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  const stepTitles = ['Vos informations', 'Sécurité', 'Profil & adresse'];
  const stepSubtitles = [
    'Nom, prénom et email',
    'Création de votre mot de passe',
    'Coordonnées et type de compte',
  ];

  return (
    <div className="min-h-screen flex bg-surface">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A1C1E] flex-col justify-between p-12 relative overflow-hidden">
        {/* Mesh decorative */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0052FF]/20 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="relative z-10">
          <img src="/images/logo_netcy_t.svg" alt="NETCY" className="h-30 w-auto brightness-0 invert" />
        </Link>

        <div className="space-y-8 relative z-10">
          <span className="inline-block chip bg-white/10 text-white/70">DIGITAL CORE</span>
          <div>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-white leading-tight mb-4">
              Rejoignez les{' '}
              <span className="text-[#0052FF] italic">premiers</span>
              <br />clients NETCY.
            </h2>
            <p className="text-white/60 leading-relaxed max-w-sm">
              NETCY vient tout juste de se lancer. En nous rejoignant maintenant, vous bénéficiez d'une attention 100% personnalisée, de tarifs de lancement et d'un suivi direct avec le fondateur.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-display font-extrabold text-3xl text-white">100%</p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Attention personnalisée</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-3xl text-white">2026</p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Nouvelle agence</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/30 relative z-10">© {new Date().getFullYear()} NETCY DIGITAL</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-16 bg-surface-container-lowest">
        <div className="flex justify-between items-center">
          <Link href="/" className="lg:hidden">
            <img src="/images/logo_netcy_t.svg" alt="NETCY" className="h-12 w-auto" />
          </Link>
          <div className="hidden lg:block" />
          <NavLink href="/connexion" className="text-sm font-medium text-on-surface-variant">
            Déjà membre ? <span className="text-[#0052FF] font-semibold hover:underline">Se connecter</span>
          </NavLink>
        </div>

        <div className="max-w-md mx-auto w-full space-y-8">
          {/* Stepper */}
          <div className="space-y-3">
            <StepDots current={step} total={totalSteps} />
            <div>
              <h1 className="font-display font-bold text-2xl text-on-surface">{stepTitles[step - 1]}</h1>
              <p className="text-sm text-outline">{stepSubtitles[step - 1]}</p>
            </div>
          </div>

          {error && (
            <div className="bg-[#FEE2E2] dark:bg-[#450A0A] rounded-xl px-4 py-3">
              <p className="text-[#BF3003] dark:text-[#FCA5A5] text-sm">{error}</p>
            </div>
          )}

          {/* ── Step 1: Identity ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nom" value={nom} onChange={setNom} placeholder="Dupont" required icon={<User size={15} strokeWidth={1.5} />} />
                <Field label="Prénom" value={prenom} onChange={setPrenom} placeholder="Jean" required />
              </div>
              <Field label="Email professionnel" type="email" value={email} onChange={setEmail} placeholder="nom@entreprise.com" required icon={<Mail size={15} strokeWidth={1.5} />} />
            </div>
          )}

          {/* ── Step 2: Password ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Mot de passe</label>
                <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#0052FF]/30 transition-all">
                  <Lock size={15} className="text-outline-variant" strokeWidth={1.5} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-on-surface text-sm placeholder:text-outline-variant focus:outline-none"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-outline-variant hover:text-outline">
                    {showPass ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                  </button>
                </div>
                <StrengthBar strength={passwordStrength} />
                <p className="text-[10px] text-outline uppercase tracking-wider">Minimum 8 caractères avec un symbole spécial</p>
              </div>
              <Field
                label="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {/* ── Step 3: Profile ── */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Account type */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Type de compte</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'particulier', label: 'Particulier', icon: <User size={14} strokeWidth={1.5} /> },
                    { value: 'entreprise', label: 'Entreprise', icon: <Building2 size={14} strokeWidth={1.5} /> },
                    { value: 'entreprise_creation', label: 'En création', icon: <Building2 size={14} strokeWidth={1.5} /> },
                    { value: 'association', label: 'Association', icon: <Users size={14} strokeWidth={1.5} /> },
                  ].map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value as typeof type)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${type === t.value ? 'bg-[#0052FF] text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {(type === 'entreprise' || type === 'entreprise_creation') && (
                <Field label="Nom de la société" value={nomSociete} onChange={setNomSociete} placeholder="NETCY SAS" required icon={<Building2 size={15} strokeWidth={1.5} />} />
              )}
              {type === 'entreprise' && (
                <Field label="SIRET" value={siret} onChange={(v) => setSiret(formatSiret(v))} placeholder="123 456 789 01234" required hint="14 chiffres" />
              )}
              {type === 'association' && (
                <Field label="Nom de l'association" value={nomAssociation} onChange={setNomAssociation} placeholder="Association..." required icon={<Users size={15} strokeWidth={1.5} />} />
              )}

              <Field label="Adresse" value={adresse} onChange={setAdresse} placeholder="12 rue de la Paix" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Code postal" value={codePostal} onChange={setCodePostal} placeholder="75001" required />
                <Field label="Téléphone" value={telephone} onChange={(v) => setTelephone(formatPhone(v))} placeholder="06 12 34 56 78" required />
              </div>

              {/* Terms */}
              <label htmlFor="terms" className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(v) => setAcceptTerms(!!v)}
                  className="mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-on-surface-variant leading-relaxed select-none">J'accepte les <NavLink keepText href="/cgu" target="_blank" onClick={(e) => e.stopPropagation()} className="text-[#0052FF] hover:underline font-medium">Conditions d'utilisation</NavLink> et la <NavLink keepText href="/politique-confidentialite" target="_blank" onClick={(e) => e.stopPropagation()} className="text-[#0052FF] hover:underline font-medium">Politique de Confidentialité</NavLink> de NETCY.</span>
              </label>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => { setError(''); setStep(step - 1); }}
                className="btn-ghost flex-1 py-3.5 text-sm"
              >
                Retour
              </button>
            )}
            <button
              type="button"
              onClick={next}
              disabled={loading}
              className="btn-primary flex-1 py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Création...' : step === totalSteps ? 'INITIALISER L\'INSCRIPTION →' : 'Continuer →'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-md mx-auto w-full">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-outline-variant pt-6 pr-14">
            <Link href="/#contact" className="hover:text-outline transition-colors underline underline-offset-2">Centre d'aide</Link>
            <span>·</span>
            <NavLink href="/politique-confidentialite" className="hover:text-outline transition-colors underline underline-offset-2">Confidentialité</NavLink>
            <span>·</span>
            <span className="flex items-center gap-1">🌐 FR (FR)</span>
          </div>
        </div>
      </div>

      {/* System status badge */}
      <div className="hidden sm:block fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-surface-container-highest rounded-full px-4 py-2 text-xs font-medium text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          SYSTÈME : OPÉRATIONNEL
        </div>
      </div>
    </div>
  );
}
