"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ClipboardList } from '@/components/animate-ui/icons/clipboard-list';
import { Send } from '@/components/animate-ui/icons/send';
import { signUp, getCurrentUser, supabase } from '@/lib/supabase';
import Stepper, { Step } from '@/components/Stepper';

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), {
  ssr: false,
});

const AnimatedContent = dynamic(() => import('@/components/AnimatedContent'), {
  ssr: false,
});

export default function InscriptionPage() {
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adresse, setAdresse] = useState('');
  const [adresseLigne2, setAdresseLigne2] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [pays, setPays] = useState('France');
  const [telephone, setTelephone] = useState('');
  const [type, setType] = useState<'particulier' | 'entreprise' | 'entreprise_creation' | 'association'>('particulier');
  const [nomSociete, setNomSociete] = useState('');
  const [siret, setSiret] = useState('');
  const [nomAssociation, setNomAssociation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    const user = await getCurrentUser();
    if (user) {
      router.push('/client');
    }
  };

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.length >= 12) strength += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 20;
    if (/\d/.test(pass)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pass)) strength += 15;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const validateForm = () => {
    if (nom.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères');
      return false;
    }

    if (prenom.trim().length < 2) {
      setError('Le prénom doit contenir au moins 2 caractères');
      return false;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Format d\'email invalide');
      return false;
    }

    if (!adresse.trim()) {
      setError('L\'adresse est requise');
      return false;
    }

    if (!codePostal.trim() || !codePostal.match(/^\d{5}$/)) {
      setError('Le code postal doit contenir 5 chiffres');
      return false;
    }

    if (!telephone.trim() || !telephone.match(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)) {
      setError('Format de téléphone invalide (ex: 06 12 34 56 78)');
      return false;
    }

    if (type === 'entreprise' || type === 'entreprise_creation') {
      if (!nomSociete.trim()) {
        setError('Le nom de la société est requis');
        return false;
      }
      if (type === 'entreprise') {
        const siretClean = siret.replace(/\s/g, '');
        if (!siretClean || !siretClean.match(/^\d{14}$/)) {
          setError('Le SIRET doit contenir 14 chiffres');
          return false;
        }
      }
    }

    if (type === 'association' && !nomAssociation.trim()) {
      setError('Le nom de l\'association est requis');
      return false;
    }

    if (password.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères');
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Le mot de passe doit contenir au moins une majuscule');
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setError('Le mot de passe doit contenir au moins une minuscule');
      return false;
    }

    if (!/\d/.test(password)) {
      setError('Le mot de passe doit contenir au moins un chiffre');
      return false;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      setError('Le mot de passe doit contenir au moins un caractère spécial');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleFinalSubmit = async () => {
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const clientData: {
        nom: string;
        prenom: string;
        adresse: string;
        adresse_ligne2: string | null;
        code_postal: string;
        pays: string;
        telephone: string;
        type: string;
        nom_societe?: string;
        siret?: string;
        nom_association?: string;
        entreprise?: string;
      } = {
        nom: nom.trim(),
        prenom: prenom.trim(),
        adresse: adresse.trim(),
        adresse_ligne2: adresseLigne2.trim() || null,
        code_postal: codePostal.trim(),
        pays: pays,
        telephone: telephone.replace(/\s/g, ''),
        type: type
      };

      if (type === 'entreprise' || type === 'entreprise_creation') {
        clientData.nom_societe = nomSociete.trim();
        clientData.entreprise = nomSociete.trim();
        if (type === 'entreprise') {
          clientData.siret = siret.replace(/\s/g, '');
        }
      } else if (type === 'association') {
        clientData.nom_association = nomAssociation.trim();
        clientData.entreprise = nomAssociation.trim();
      } else {
        clientData.entreprise = 'Particulier';
      }

      const { data, error: signUpError } = await signUp(email, password, clientData);
      
      if (signUpError) {
        console.error('Erreur signUp:', signUpError);
        if (signUpError.message.includes('already registered')) {
          setError('Cet email est déjà utilisé');
        } else {
          setError(`Erreur lors de l'inscription: ${signUpError.message}`);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/connexion');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Erreur catch:', err);
      setError(`Une erreur est survenue: ${err.message || err}`);
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength >= 80) return 'bg-green-500';
    if (passwordStrength >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStrengthText = () => {
    if (passwordStrength >= 80) return 'Fort';
    if (passwordStrength >= 50) return 'Moyen';
    return 'Faible';
  };

  if (success) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 w-full h-full">
          <LiquidEther
            colors={['#3F12F3', '#4670D2', '#5670A4', '#2A0F7F']}
            mouseForce={20}
            cursorSize={100}
            autoDemo={true}
          />
        </div>
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <Send 
                    size={32} 
                    className="text-green-400" 
                    strokeWidth={1.5}
                    animate={true}
                    animation="default"
                    loop={true}
                    loopDelay={2000}
                  />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Inscription réussie !</h1>
                <p className="text-gray-300">Email de confirmation envoyé</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-gray-300 text-sm text-center">
                    Un email de confirmation a été envoyé à <strong className="text-white">{email}</strong>
                  </p>
                </div>
                
                <p className="text-gray-300 text-sm text-center">
                  Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.
                </p>
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-xs text-center">
                    Redirection automatique vers la page de connexion dans 3 secondes...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 w-full h-full">
        <LiquidEther
          colors={['#3F12F3', '#4670D2', '#5670A4', '#2A0F7F']}
          mouseForce={20}
          cursorSize={100}
          autoDemo={true}
        />
      </div>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10 py-12">
        <div className="w-full max-w-3xl">
          <AnimatedContent distance={30} duration={0.6}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                  <ClipboardList 
                    size={32} 
                    className="text-purple-400" 
                    strokeWidth={1.5}
                    animate={true}
                    animation="default"
                    loop={true}
                    loopDelay={2000}
                  />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Inscription</h1>
                <p className="text-gray-300">Créez votre compte NETCY</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

            <Stepper
              onFinalStepCompleted={handleFinalSubmit}
              nextButtonText="Suivant"
              backButtonText="Retour"
            >
              {/* Étape 1: Type de compte */}
              <Step>
                <div className="space-y-4 p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Type de compte</h3>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-200 mb-2">
                    Sélectionnez votre type de compte *
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="particulier" className="bg-gray-800">Particulier</option>
                    <option value="entreprise" className="bg-gray-800">Entreprise</option>
                    <option value="entreprise_creation" className="bg-gray-800">Entreprise en création</option>
                    <option value="association" className="bg-gray-800">Association</option>
                  </select>
                </div>
              </Step>

              {/* Étape 2: Informations personnelles + Entreprise/Association */}
              <Step>
                <div className="space-y-6 p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Informations personnelles</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-200 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        id="nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                        minLength={2}
                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Dupont"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="prenom" className="block text-sm font-medium text-gray-200 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        id="prenom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required
                        minLength={2}
                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Jean"
                      />
                    </div>
                  </div>

                  {(type === 'entreprise' || type === 'entreprise_creation') && (
                    <div className="space-y-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20 mt-6">
                      <h4 className="text-lg font-semibold text-white border-b border-purple-500/30 pb-2">Informations entreprise</h4>
                      <div>
                        <label htmlFor="nomSociete" className="block text-sm font-medium text-gray-200 mb-2">
                          Nom de la société *
                        </label>
                        <input
                          type="text"
                          id="nomSociete"
                          value={nomSociete}
                          onChange={(e) => setNomSociete(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Ma Société SARL"
                        />
                      </div>
                      {type === 'entreprise' && (
                        <div>
                          <label htmlFor="siret" className="block text-sm font-medium text-gray-200 mb-2">
                            SIRET *
                          </label>
                          <input
                            type="text"
                            id="siret"
                            value={siret}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, '');
                              const formatted = value.match(/.{1,3}/g)?.join(' ') || value;
                              setSiret(formatted);
                            }}
                            required
                            maxLength={18}
                            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="123 456 789 01234"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {type === 'association' && (
                    <div className="space-y-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20 mt-6">
                      <h4 className="text-lg font-semibold text-white border-b border-purple-500/30 pb-2">Informations association</h4>
                      <div>
                        <label htmlFor="nomAssociation" className="block text-sm font-medium text-gray-200 mb-2">
                          Nom de l&apos;association *
                        </label>
                        <input
                          type="text"
                          id="nomAssociation"
                          value={nomAssociation}
                          onChange={(e) => setNomAssociation(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Mon Association"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Step>

              {/* Étape 3: Contact */}
              <Step>
                <div className="space-y-6 p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Contact</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="telephone" className="block text-sm font-medium text-gray-200 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        value={telephone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '');
                          const formatted = value.match(/.{1,2}/g)?.join(' ') || value;
                          setTelephone(formatted);
                        }}
                        required
                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>
              </Step>

              {/* Étape 4: Adresse */}
              <Step>
                <div className="space-y-6 p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Adresse</h3>
                  
                  <div>
                    <label htmlFor="adresse" className="block text-sm font-medium text-gray-200 mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      id="adresse"
                      value={adresse}
                      onChange={(e) => setAdresse(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="123 Rue de la Paix"
                    />
                  </div>
                  <div>
                    <label htmlFor="adresseLigne2" className="block text-sm font-medium text-gray-200 mb-2">
                      Complément d&apos;adresse (facultatif)
                    </label>
                    <input
                      type="text"
                      id="adresseLigne2"
                      value={adresseLigne2}
                      onChange={(e) => setAdresseLigne2(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Appartement, étage, bâtiment..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label htmlFor="codePostal" className="block text-sm font-medium text-gray-200 mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        id="codePostal"
                        value={codePostal}
                        onChange={(e) => setCodePostal(e.target.value)}
                        required
                        maxLength={5}
                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="75001"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="pays" className="block text-sm font-medium text-gray-200 mb-2">
                        Pays *
                      </label>
                      <input
                        type="text"
                        id="pays"
                        value={pays}
                        onChange={(e) => setPays(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="France"
                      />
                    </div>
                  </div>
                </div>
              </Step>

              {/* Étape 5: Sécurité */}
              <Step>
                <div className="space-y-6 p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Sécurité</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                          Mot de passe *
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={12}
                          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="••••••••••••"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                          Confirmer le mot de passe *
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="••••••••••••"
                        />
                      </div>
                    </div>
                    
                    {password && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">Force du mot de passe</span>
                          <span className={`text-xs font-semibold ${passwordStrength >= 80 ? 'text-green-400' : passwordStrength >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {getStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400">
                      Min 12 caractères, majuscules, minuscules, chiffres et caractères spéciaux
                    </p>
                  </div>
                </div>
              </Step>
            </Stepper>

            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Déjà un compte?{' '}
                <Link href="/connexion" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={20} duration={0.5} delay={0.8}>
            <div className="mt-8 text-center">
              <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}
