'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { TrendingUp, CheckCircle, Clock, Percent } from 'lucide-react';
import { gsap } from 'gsap';

interface Project {
  id: string;
  titre: string;
  status: string;
  progress: number;
}

interface Stats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageProgress: number;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  delay = 0 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>; 
  color: string; 
  delay?: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power2.out' }
      );
    }
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cardRef.current?.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current?.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative bg-[#060010] border border-[#392e4e] rounded-2xl p-6 overflow-hidden group"
      style={{
        background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(${color}, 0.1), transparent 40%)`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#060010]/50" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon size={32} className="transition-transform group-hover:scale-110" style={{ color: `rgb(${color})` }} />
          <div className={`px-3 py-1 rounded-full text-xs font-semibold`} style={{ 
            background: `rgba(${color}, 0.1)`,
            color: `rgb(${color})`
          }}>
            Live
          </div>
        </div>
        
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>

      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(${color}, 0.15), transparent 70%)`
        }}
      />
    </div>
  );
};

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    averageProgress: 0
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [userName, setUserName] = useState('');

  const fetchData = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data: clientData } = await supabase
      .from('clients')
      .select('nom')
      .eq('id', user.id)
      .single();

    if (clientData) {
      setUserName(clientData.nom);
    }

    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (projectsData) {
      setProjects(projectsData);
      
      const totalProjects = projectsData.length;
      const activeProjects = projectsData.filter(p => p.status === 'en_cours').length;
      const completedProjects = projectsData.filter(p => p.status === 'termine').length;
      const averageProgress = totalProjects > 0 
        ? Math.round(projectsData.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
        : 0;

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        averageProgress
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            Bienvenue, <span className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] bg-clip-text text-transparent">{userName}</span>
          </h1>
          <p className="text-gray-400 text-lg">Voici un aperçu de vos projets et activités</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Projets Totaux"
            value={stats.totalProjects}
            icon={TrendingUp}
            color="111, 63, 255"
            delay={0}
          />
          <StatCard
            title="Projets Actifs"
            value={stats.activeProjects}
            icon={Clock}
            color="122, 143, 255"
            delay={0.1}
          />
          <StatCard
            title="Projets Terminés"
            value={stats.completedProjects}
            icon={CheckCircle}
            color="143, 165, 255"
            delay={0.2}
          />
          <StatCard
            title="Progression Moyenne"
            value={`${stats.averageProgress}%`}
            icon={Percent}
            color="74, 47, 255"
            delay={0.3}
          />
        </div>

        <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Projets Récents</h2>
          
          {projects.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Aucun projet pour le moment</p>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="bg-[#060010] border border-[#392e4e] rounded-xl p-6 hover:border-[#6F3FFF]/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#8FA5FF] transition-colors">
                      {project.titre}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      project.status === 'en_cours' 
                        ? 'bg-blue-400/10 text-blue-400' 
                        : project.status === 'termine'
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-yellow-400/10 text-yellow-400'
                    }`}>
                      {project.status === 'en_cours' ? 'En cours' : project.status === 'termine' ? 'Terminé' : 'En attente'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-[#6F3FFF]/20 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-white font-bold text-sm min-w-[3rem] text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
