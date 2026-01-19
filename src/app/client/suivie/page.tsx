'use client';

import { useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import SpotlightCard from '@/components/SpotlightCard';
import Modal from '@/components/Modal';
import { Clock } from '@/components/animate-ui/icons/clock';
import { CheckCircle } from '@/components/animate-ui/icons/check-circle';
import { AlertCircle } from '@/components/animate-ui/icons/alert-circle';
import { Activity } from '@/components/animate-ui/icons/activity';
import { MessageCircle } from '@/components/animate-ui/icons/message-circle';
import { X } from '@/components/animate-ui/icons/x';

interface Message {
  id: string;
  sujet: string;
  contenu: string;
  created_at: string;
  lu: boolean;
}

interface Project {
  id: string;
  titre: string;
  description: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'en_cours':
      return <Activity className="text-blue-400" size={20} animate={true} loop={true} loopDelay={5000} />;
    case 'termine':
      return <CheckCircle className="text-green-400" size={20} animate={true} loop={true} loopDelay={5000} />;
    case 'en_attente':
      return <Clock className="text-yellow-400" size={20} animate={true} loop={true} loopDelay={5000} />;
    default:
      return <AlertCircle className="text-gray-400" size={20} animate={true} loop={true} loopDelay={5000} />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'en_cours':
      return 'En Cours';
    case 'termine':
      return 'Terminé';
    case 'en_attente':
      return 'En Attente';
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
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchProjects = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (projectsData) {
      const projectsWithMessages = await Promise.all(
        projectsData.map(async (project) => {
          const { data: messagesData } = await supabase
            .from('messages')
            .select('*')
            .eq('project_id', project.id)
            .order('created_at', { ascending: false })
            .limit(3);

          return {
            ...project,
            messages: messagesData || []
          };
        })
      );

      setProjects(projectsWithMessages);
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
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            Suivi des <span className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] bg-clip-text text-transparent">Projets</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Suivez l'évolution de vos projets en temps réel</p>
        </div>

        <div className="flex gap-2 sm:gap-4 mb-6 md:mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            Tous ({projects.length})
          </button>
          <button
            onClick={() => setFilter('en_cours')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition ${
              filter === 'en_cours'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">En Cours</span>
            <span className="sm:hidden">Cours</span> ({projects.filter(p => p.status === 'en_cours').length})
          </button>
          <button
            onClick={() => setFilter('termine')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition ${
              filter === 'termine'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            Terminés ({projects.filter(p => p.status === 'termine').length})
          </button>
          <button
            onClick={() => setFilter('en_attente')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition ${
              filter === 'en_attente'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">En Attente</span>
            <span className="sm:hidden">Attente</span> ({projects.filter(p => p.status === 'en_attente').length})
          </button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-lg">Aucun projet dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <SpotlightCard
                key={project.id}
                className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#392e4e] rounded-2xl p-6 hover:border-[#6F3FFF]/50 transition-all animate-slide-in-up"
                spotlightColor="rgba(111, 63, 255, 0.25)"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{project.titre}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm ${getStatusColor(project.status)} self-start`}>
                    {getStatusIcon(project.status)}
                    <span className="font-semibold">{getStatusLabel(project.status)}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {project.messages && project.messages.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 mb-3 animate-fade-in">
                      <MessageCircle className="text-[#6F3FFF] animate-pulse" size={18} animate={true} loop={true} loopDelay={5000} />
                      <h4 className="text-sm font-semibold text-white">Messages récents</h4>
                    </div>
                    {project.messages.map((message, index) => (
                      <div
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className="bg-[#060010]/50 border border-[#6F3FFF]/20 rounded-lg p-3 hover:border-[#6F3FFF]/40 hover:bg-[#6F3FFF]/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6F3FFF]/10 animate-slide-in-up cursor-pointer"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h5 className="text-sm font-semibold text-white group-hover:text-[#8FA5FF] transition-colors">{message.sujet}</h5>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(message.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">{message.contenu}</p>
                        {!message.lu && (
                          <div className="mt-2 flex items-center gap-1">
                            <div className="w-2 h-2 bg-[#6F3FFF] rounded-full animate-ping" />
                            <span className="text-xs text-[#6F3FFF] font-semibold">Nouveau</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

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

      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.sujet || ''}
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-400 pb-3 border-b border-[#392e4e]">
              <span>Message reçu le {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', { 
                day: 'numeric',
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
              {!selectedMessage.lu && (
                <span className="flex items-center gap-1 text-[#6F3FFF] font-semibold">
                  <div className="w-2 h-2 bg-[#6F3FFF] rounded-full" />
                  Nouveau
                </span>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/20 rounded-xl p-6">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.contenu}</p>
            </div>

            <button
              onClick={() => setSelectedMessage(null)}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              Fermer
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
