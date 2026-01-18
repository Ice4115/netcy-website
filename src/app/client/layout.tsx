'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase';
import Dock from '@/components/Dock';
import { Home, Activity, FileText, User, Settings, LayoutDashboard } from 'lucide-react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const dockItems = [
    {
      label: 'Accueil',
      icon: <Home size={24} className="text-white" />,
      onClick: () => window.location.href = '/',
      className: ''
    },
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={24} className="text-white" />,
      onClick: () => router.push('/client'),
      className: pathname === '/client' ? 'bg-gradient-to-br from-[#6F3FFF] to-[#7A8FFF]' : ''
    },
    {
      label: 'Suivie',
      icon: <Activity size={24} className="text-white" />,
      onClick: () => router.push('/client/suivie'),
      className: pathname === '/client/suivie' ? 'bg-gradient-to-br from-[#6F3FFF] to-[#7A8FFF]' : ''
    },
    {
      label: 'Facture',
      icon: <FileText size={24} className="text-white" />,
      onClick: () => router.push('/client/facture'),
      className: pathname === '/client/facture' ? 'bg-gradient-to-br from-[#6F3FFF] to-[#7A8FFF]' : ''
    },
    {
      label: 'Profile',
      icon: <User size={24} className="text-white" />,
      onClick: () => router.push('/client/profile'),
      className: pathname === '/client/profile' ? 'bg-gradient-to-br from-[#6F3FFF] to-[#7A8FFF]' : ''
    },
    {
      label: 'Settings',
      icon: <Settings size={24} className="text-white" />,
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
      {children}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
        <Dock 
          items={dockItems}
          magnification={70}
          distance={200}
          panelHeight={68}
          baseItemSize={50}
        />
      </div>
    </div>
  );
}
