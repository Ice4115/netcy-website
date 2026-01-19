'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/supabase';
import Dock from '@/components/Dock';
import { Home as HomeIcon } from '@/components/animate-ui/icons/home';
import { Activity } from '@/components/animate-ui/icons/activity';
import { FileText } from '@/components/animate-ui/icons/file-text';
import { User } from '@/components/animate-ui/icons/user';
import { Settings } from '@/components/animate-ui/icons/settings';
import { LayoutDashboard } from '@/components/animate-ui/icons/layout-dashboard';
import { LogOut } from '@/components/animate-ui/icons/log-out';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.push('/connexion');
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const dockItems = [
    {
      label: 'Accueil',
      icon: <HomeIcon size={24} className="text-white" animate={true} loop={true} loopDelay={5000} />,
      onClick: () => window.location.href = '/',
      className: ''
    },
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={24} className="text-white" animate={true} loop={true} loopDelay={5000} />,
      onClick: () => router.push('/client'),
      className: pathname === '/client' ? 'bg-gradient-to-br from-[#6F3FFF] to-[#7A8FFF]' : ''
    },
    {
      label: 'Suivie',
      icon: <Activity size={24} className="text-white" animate={true} loop={true} loopDelay={5000} />,
      onClick: () => router.push('/client/suivie'),
      className: pathname === '/client/suivie' ? 'bg-gradient-to-br from-[#6F3FFF] to-[#7A8FFF]' : ''
    },
    {
      label: 'Facture',
      icon: <FileText size={24} className="text-white" animate={true} loop={true} loopDelay={5000} />,
      onClick: () => router.push('/client/facture'),
      className: pathname === '/client/facture' ? 'bg-gradient-to-br from-[#6F3FFF] to-[#7A8FFF]' : ''
    },
    {
      label: 'Profile',
      icon: <User size={24} className="text-white" animate={true} loop={true} loopDelay={5000} />,
      onClick: () => router.push('/client/profile'),
      className: pathname === '/client/profile' ? 'bg-gradient-to-br from-[#6F3FFF] to-[#7A8FFF]' : ''
    },
    {
      label: 'Settings',
      icon: <Settings size={24} className="text-white" animate={true} loop={true} loopDelay={5000} />,
      onClick: () => router.push('/client/settings'),
      className: pathname === '/client/settings' ? 'bg-gradient-to-br from-[#6F3FFF] to-[#7A8FFF]' : ''
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#110F1B] to-[#1a0f3a]">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110F1B] to-[#1a0f3a] pb-28">
      <button
        onClick={handleSignOut}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white bg-[#060010]/80 backdrop-blur-sm border border-[#392e4e] hover:border-[#6F3FFF]/50 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#6F3FFF]/20"
        title="Déconnexion"
      >
        <LogOut size={18} animate={true} loop={true} loopDelay={5000} />
        <span className="hidden sm:inline">Déconnexion</span>
      </button>
      {children}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4">
        <Dock 
          items={dockItems}
          magnification={isMobile ? 55 : 70}
          distance={isMobile ? 120 : 200}
          panelHeight={isMobile ? 60 : 68}
          baseItemSize={isMobile ? 44 : 50}
        />
      </div>
    </div>
  );
}
