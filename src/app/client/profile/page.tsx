'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { Fingerprint } from '@/components/animate-ui/icons/fingerprint';
import { Activity } from '@/components/animate-ui/icons/activity';
import { Lock } from '@/components/animate-ui/icons/lock';
import { Building } from '@/components/animate-ui/icons/building';
import { Mail } from '@/components/animate-ui/icons/mail';
import { Phone } from '@/components/animate-ui/icons/phone';

interface ClientData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  entreprise?: string;
  type: string;
  created_at: string;
}

const ReflectiveProfileCard = ({ clientData }: { clientData: ClientData }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
      }
    };

    startWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;

    if (!card || !glare) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      
      glare.style.background = `radial-gradient(circle 300px at ${xPercent}% ${yPercent}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)`;
    };

    const handleMouseEnter = () => {
      glare.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      glare.style.opacity = '0';
      glare.style.background = 'transparent';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const formattedId = clientData.id.slice(0, 13).toUpperCase().replace(/(.{4})/g, '$1-').slice(0, -1);

  return (
    <div ref={cardRef} className="reflective-card-container max-w-md w-full">
      <style jsx>{`
        .reflective-card-container {
          --blur-strength: 12px;
          --metalness: 1;
          --roughness: 0.4;
          --overlay-color: rgba(111, 63, 255, 0.1);
          --text-color: white;
          --saturation: 0;
          position: relative;
          aspect-ratio: 1.2;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        @media (max-width: 640px) {
          .reflective-card-container {
            aspect-ratio: 1.1;
          }
        }

        .reflective-svg-filters {
          position: absolute;
          width: 0;
          height: 0;
        }

        .reflective-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: url(#metallic-displacement) blur(var(--blur-strength)) saturate(var(--saturation));
        }

        .reflective-noise,
        .reflective-glare,
        .reflective-border {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .reflective-noise {
          background: linear-gradient(135deg, 
            rgba(111, 63, 255, 0.1) 0%, 
            transparent 50%, 
            rgba(122, 143, 255, 0.1) 100%);
          mix-blend-mode: overlay;
        }

        .reflective-glare {
          background: transparent;
          mix-blend-mode: screen;
          z-index: 5;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .reflective-card-container:hover .reflective-glare {
          opacity: 1;
        }

        .reflective-border {
          background: linear-gradient(135deg, 
            rgba(111, 63, 255, 0.5), 
            rgba(122, 143, 255, 0.5));
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          padding: 2px;
        }

        .reflective-content {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2rem;
          color: var(--text-color);
          z-index: 10;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(111, 63, 255, 0.2);
          border: 1px solid rgba(111, 63, 255, 0.5);
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .security-icon {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-icon {
          color: #4ade80;
          filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.6));
        }

        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .user-info {
          backdrop-filter: blur(8px);
          background: rgba(6, 0, 16, 0.3);
          border: 1px solid rgba(111, 63, 255, 0.3);
          padding: 1.5rem;
          border-radius: 12px;
        }

        .user-name {
          font-size: 1.875rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: linear-gradient(135deg, #fff, #8FA5FF);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .user-role {
          font-size: 1rem;
          color: #8FA5FF;
          font-weight: 600;
          letter-spacing: 0.1em;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .id-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .label {
          font-size: 0.75rem;
          color: #8FA5FF;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .value {
          font-size: 1rem;
          font-weight: 700;
          font-family: monospace;
          color: #fff;
        }

        .fingerprint-section {
          opacity: 0.8;
        }

        .fingerprint-icon {
          color: #6F3FFF;
          filter: drop-shadow(0 0 8px rgba(111, 63, 255, 0.6));
        }
      `}</style>

      <svg className="reflective-svg-filters" aria-hidden="true">
        <defs>
          <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale="20"
              specularConstant="1.2"
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
          </filter>
        </defs>
      </svg>

      <video ref={videoRef} autoPlay playsInline muted className="reflective-video" />

      <div className="reflective-noise" />
      <div ref={glareRef} className="reflective-glare" />
      <div className="reflective-border" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="security-badge">
            <Lock size={14} className="security-icon" />
            <span>NETCY CLIENT</span>
          </div>
          <Activity className="status-icon" size={20} loop={true} loopDelay={2000} />
        </div>

        <div className="card-body">
          <div className="user-info">
            <h2 className="user-name">
              {clientData.nom || 'Non renseigné'} {clientData.prenom || ''}
            </h2>
            <p className="user-role">{clientData.entreprise || 'PARTICULIER'}</p>
          </div>
        </div>

        <div className="card-footer">
          <div className="id-section">
            <span className="label">ID NUMBER</span>
            <span className="value">{formattedId}</span>
          </div>
          <div className="fingerprint-section">
            <Fingerprint size={32} className="fingerprint-icon" loop={true} loopDelay={2000} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<ClientData | null>(null);

  const fetchClientData = async () => {
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setClientData(data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-white text-xl">Données non disponibles</p>
        <p className="text-gray-400 text-sm">Veuillez vous reconnecter</p>
        <button 
          onClick={() => window.location.href = '/connexion'}
          className="px-6 py-2 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] rounded-lg text-white font-semibold hover:opacity-90 transition"
        >
          Se reconnecter
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            Mon <span className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] bg-clip-text text-transparent">Profil</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Vos informations personnelles sécurisées</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          <div className="flex justify-center w-full">
            <div className="w-full max-w-sm">
              <ReflectiveProfileCard clientData={clientData} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Informations Personnelles</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#6F3FFF]/20 rounded-lg">
                    <Mail className="text-[#8FA5FF]" size={20} loop={true} loopDelay={2000} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white font-semibold">{clientData.email}</p>
                  </div>
                </div>

                {clientData.telephone && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#7A8FFF]/20 rounded-lg">
                      <Phone className="text-[#8FA5FF]" size={20} loop={true} loopDelay={2000} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Téléphone</p>
                      <p className="text-white font-semibold">
                        {clientData.telephone.replace(/\s/g, '').match(/.{1,2}/g)?.join(' ') || clientData.telephone}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#8FA5FF]/20 rounded-lg">
                    <Building className="text-[#8FA5FF]" size={20} loop={true} loopDelay={2000} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Type de compte</p>
                    <p className="text-white font-semibold capitalize">{clientData.type}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Sécurité</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-400/10 border border-green-400/30 rounded-lg flex items-center gap-3">
                  <Lock className="text-green-400" size={20} loop={true} loopDelay={2000} />
                  <div>
                    <p className="text-green-400 font-semibold">Compte Sécurisé</p>
                    <p className="text-gray-400 text-sm">Votre compte est protégé</p>
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  <p>Membre depuis le <span className="text-white font-semibold">
                    {new Date(clientData.created_at).toLocaleDateString('fr-FR')}
                  </span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
