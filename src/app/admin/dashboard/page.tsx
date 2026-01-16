'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, signOut, getCurrentUser } from '@/lib/supabase';

interface Client {
  id: string;
  nom: string;
  email: string;
  type: string;
  role: string;
  created_at: string;
}

interface Project {
  id: string;
  titre: string;
  description: string;
  status: string;
  progress: number;
  client_id: string;
  clients?: {
    nom: string;
  };
}

interface Invoice {
  id: string;
  montant: number;
  statut: string;
  created_at: string;
  clients?: {
    nom: string;
  };
  projects?: {
    titre: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<'clients' | 'projects' | 'invoices'>('clients');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user) {
      console.error('Aucun utilisateur connecté');
      router.push('/admin/login');
      return;
    }

    console.log('Utilisateur connecté:', user.id);

    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log('Données client:', clientData);
    console.log('Erreur client:', clientError);

    if (!clientData) {
      console.error('Profil client non trouvé dans la table clients. UUID:', user.id);
      alert(`ERREUR: Profil admin non configuré.\n\nVotre UUID est: ${user.id}\n\nAllez dans Supabase SQL Editor et exécutez:\n\nINSERT INTO clients (id, nom, email, type, role)\nVALUES ('${user.id}', 'Jean-Marie Jung', '${user.email}', 'entreprise', 'admin');`);
      router.push('/admin/login');
      return;
    }

    if (clientData?.role !== 'admin') {
      console.error('Utilisateur non admin. Rôle:', clientData.role);
      router.push('/admin/login');
      return;
    }

    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);

    const { data: clientsData } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: projectsData } = await supabase
      .from('projects')
      .select(`
        *,
        clients (
          nom
        )
      `)
      .order('created_at', { ascending: false });

    const { data: invoicesData } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          nom
        ),
        projects (
          titre
        )
      `)
      .order('created_at', { ascending: false });

    setClients(clientsData || []);
    setProjects(projectsData || []);
    setInvoices(invoicesData || []);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'en_cours':
        return 'text-blue-400 bg-blue-400/10';
      case 'termine':
        return 'text-green-400 bg-green-400/10';
      case 'payee':
        return 'text-green-400 bg-green-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#110F1B] to-[#1a0f3a]">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110F1B] to-[#1a0f3a] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard Admin</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition border border-red-500/50"
          >
            Déconnexion
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'clients'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#0f0a20] text-gray-400 hover:text-white'
            }`}
          >
            Clients ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#0f0a20] text-gray-400 hover:text-white'
            }`}
          >
            Projets ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'invoices'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#0f0a20] text-gray-400 hover:text-white'
            }`}
          >
            Factures ({invoices.length})
          </button>
        </div>

        {activeTab === 'clients' && (
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Liste des Clients</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#6F3FFF]/30">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nom</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Rôle</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-[#6F3FFF]/10 hover:bg-[#6F3FFF]/5">
                      <td className="py-3 px-4 text-white">{client.nom}</td>
                      <td className="py-3 px-4 text-gray-300">{client.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-400/10 text-blue-400">
                          {client.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          client.role === 'admin' ? 'bg-purple-400/10 text-purple-400' : 'bg-gray-400/10 text-gray-400'
                        }`}>
                          {client.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(client.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length === 0 && (
                <p className="text-gray-400 text-center py-8">Aucun client pour le moment</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Liste des Projets</h2>
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#0f0a20]/50 border border-[#6F3FFF]/20 rounded-lg p-6 hover:border-[#6F3FFF]/40 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{project.titre}</h3>
                      <p className="text-gray-400 text-sm">
                        Client: {project.clients?.nom || 'N/A'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-[#6F3FFF]/20 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-white font-semibold">{project.progress}%</span>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-gray-400 text-center py-8">Aucun projet pour le moment</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Liste des Factures</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#6F3FFF]/30">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Client</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Projet</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Montant</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Statut</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-[#6F3FFF]/10 hover:bg-[#6F3FFF]/5">
                      <td className="py-3 px-4 text-white">{invoice.clients?.nom || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-300">{invoice.projects?.titre || 'N/A'}</td>
                      <td className="py-3 px-4 text-white font-semibold">{invoice.montant.toFixed(2)} €</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(invoice.statut)}`}>
                          {invoice.statut === 'payee' ? 'Payée' : 'En attente'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {invoices.length === 0 && (
                <p className="text-gray-400 text-center py-8">Aucune facture pour le moment</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
