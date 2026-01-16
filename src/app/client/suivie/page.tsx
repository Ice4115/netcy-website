'use client';

import { useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import SpotlightCard from '@/components/SpotlightCard';
import { Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';

interface Project {
  id: string;
  titre: string;
  description: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'en_cours':
      return <Activity className="text-blue-400" size={20} />;
    case 'termine':
      return <CheckCircle className="text-green-400" size={20} />;
    case 'en_attente':
      return <Clock className="text-yellow-400" size={20} />;
    default:
      return <AlertCircle className="text-gray-400" size={20} />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'en_cours':
      return 'En cours';
    case 'termine':
      return 'Terminé';
    case 'en_attente':
      return 'En attente';
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'en_cours':
      return 'bg-blue-400/10 text-blue-400 border-blue-400/30';
    case 'termine':
      return 'bg-green-400/10 text-green-400 border-green-400/30';
    case 'en_attente':
      return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30';
    default:
      return 'bg-gray-400/10 text-gray-400 border-gray-400/30';
  }
};

export default function SuiviePage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const fetchProjects = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter);

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
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Suivi des <span className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] bg-clip-text text-transparent">Projets</span>
          </h1>
          <p className="text-gray-400 text-lg">Suivez l'évolution de vos projets en temps réel</p>
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            Tous ({projects.length})
          </button>
          <button
            onClick={() => setFilter('en_cours')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'en_cours'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            En cours ({projects.filter(p => p.status === 'en_cours').length})
          </button>
          <button
            onClick={() => setFilter('termine')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'termine'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            Terminés ({projects.filter(p => p.status === 'termine').length})
          </button>
          <button
            onClick={() => setFilter('en_attente')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'en_attente'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            En attente ({projects.filter(p => p.status === 'en_attente').length})
          </button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-lg">Aucun projet dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <SpotlightCard
                key={project.id}
                className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#392e4e] rounded-2xl p-6 hover:border-[#6F3FFF]/50 transition-all"
                spotlightColor="rgba(111, 63, 255, 0.25)"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{project.titre}</h3>
                    <p className="text-gray-400 text-sm">
                      Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    <span className="font-semibold text-sm">{getStatusLabel(project.status)}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Progression</span>
                    <span className="text-white font-bold">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-[#6F3FFF]/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#6F3FFF] via-[#7A8FFF] to-[#8FA5FF] h-3 rounded-full transition-all duration-500 relative"
                      style={{ width: `${project.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#392e4e]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Dernière mise à jour</span>
                    <span className="text-gray-300">
                      {new Date(project.updated_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
