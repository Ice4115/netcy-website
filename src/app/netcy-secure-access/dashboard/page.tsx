'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, signOut, getCurrentUser } from '@/lib/supabase';
import Modal from '@/components/Modal';
import { Plus, Edit, Trash2, Send } from 'lucide-react';

interface Client {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  type: string;
  role: string;
  entreprise?: string;
  created_at: string;
}

interface Project {
  id: string;
  titre: string;
  description: string;
  status: string;
  progress: number;
  client_id: string;
  url?: string;
  type?: string;
  clients?: {
    nom: string;
    prenom?: string;
  };
}

interface Invoice {
  id: string;
  numero_facture?: string;
  montant: number;
  statut: string;
  description?: string;
  client_id: string;
  project_id?: string;
  due_date?: string;
  pdf_url?: string;
  created_at: string;
  clients?: {
    nom: string;
  };
  projects?: {
    titre: string;
  };
}

interface Message {
  id: string;
  client_id: string;
  sujet: string;
  contenu: string;
  lu: boolean;
  created_at: string;
  clients?: {
    nom: string;
    prenom?: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'clients' | 'projects' | 'invoices' | 'messages'>('clients');
  
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [clientForm, setClientForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    type: 'particulier',
    entreprise: ''
  });

  const [projectForm, setProjectForm] = useState({
    titre: '',
    description: '',
    status: 'en_attente',
    progress: 0,
    client_id: '',
    url: '',
    type: 'site_internet'
  });

  const [invoiceForm, setInvoiceForm] = useState({
    numero_facture: '',
    montant: '',
    statut: 'en_attente',
    description: '',
    client_id: '',
    project_id: '',
    due_date: '',
    pdf_url: ''
  });

  const [uploadingPdf, setUploadingPdf] = useState(false);

  const [messageForm, setMessageForm] = useState({
    client_id: '',
    sujet: '',
    contenu: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.push('/netcy-secure-access');
      return;
    }

    const { data: clientData } = await supabase
      .from('clients')
      .select('role')
      .eq('id', user.id)
      .single();

    if (clientData?.role !== 'admin') {
      router.push('/netcy-secure-access');
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
          nom,
          prenom
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

    const { data: messagesData } = await supabase
      .from('messages')
      .select(`
        *,
        clients (
          nom,
          prenom
        )
      `)
      .order('created_at', { ascending: false });

    setClients(clientsData || []);
    setProjects(projectsData || []);
    setInvoices(invoicesData || []);
    setMessages(messagesData || []);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/netcy-secure-access');
  };

  const openEditClient = (client: Client) => {
    setEditingClient(client);
    setClientForm({
      nom: client.nom,
      prenom: client.prenom || '',
      email: client.email,
      telephone: client.telephone || '',
      type: client.type,
      entreprise: client.entreprise || ''
    });
    setIsClientModalOpen(true);
  };

  const openEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      titre: project.titre,
      description: project.description,
      status: project.status,
      progress: project.progress,
      client_id: project.client_id,
      url: project.url || '',
      type: project.type || 'site_internet'
    });
    setIsProjectModalOpen(true);
  };

  const openEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setInvoiceForm({
      numero_facture: invoice.numero_facture || '',
      montant: invoice.montant.toString(),
      statut: invoice.statut,
      description: invoice.description || '',
      client_id: invoice.client_id,
      project_id: invoice.project_id || '',
      due_date: invoice.due_date || '',
      pdf_url: invoice.pdf_url || ''
    });
    setIsInvoiceModalOpen(true);
  };

  const resetClientForm = () => {
    setClientForm({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      type: 'particulier',
      entreprise: ''
    });
    setEditingClient(null);
  };

  const resetProjectForm = () => {
    setProjectForm({
      titre: '',
      description: '',
      status: 'en_attente',
      progress: 0,
      client_id: '',
      url: '',
      type: 'site_internet'
    });
    setEditingProject(null);
  };

  const resetInvoiceForm = () => {
    setInvoiceForm({
      numero_facture: '',
      montant: '',
      statut: 'en_attente',
      description: '',
      client_id: '',
      project_id: '',
      due_date: '',
      pdf_url: ''
    });
    setEditingInvoice(null);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Seuls les fichiers PDF sont acceptés');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier ne doit pas dépasser 10 MB');
      return;
    }

    setUploadingPdf(true);

    try {
      const fileExt = 'pdf';
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `invoices/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setInvoiceForm({ ...invoiceForm, pdf_url: publicUrl });
      alert('PDF uploadé avec succès');
    } catch (error: any) {
      alert('Erreur lors de l\'upload: ' + (error?.message || 'Une erreur est survenue'));
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleRemovePdf = async () => {
    if (!invoiceForm.pdf_url) return;

    if (!confirm('Voulez-vous vraiment supprimer ce PDF ?')) return;

    try {
      if (invoiceForm.pdf_url.includes('supabase')) {
        const urlParts = invoiceForm.pdf_url.split('/');
        const filePath = `invoices/${urlParts[urlParts.length - 1]}`;
        
        await supabase.storage
          .from('documents')
          .remove([filePath]);
      }

      setInvoiceForm({ ...invoiceForm, pdf_url: '' });
      alert('PDF supprimé avec succès');
    } catch (error: any) {
      alert('Erreur lors de la suppression: ' + (error?.message || 'Une erreur est survenue'));
    }
  };

  const resetMessageForm = () => {
    setMessageForm({
      client_id: '',
      sujet: '',
      contenu: ''
    });
  };

  const handleSaveClient = async () => {
    if (!clientForm.nom || !clientForm.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(clientForm)
          .eq('id', editingClient.id);

        if (error) throw error;
      }

      setIsClientModalOpen(false);
      resetClientForm();
      fetchData();
    } catch (error) {
      alert('Une erreur est survenue');
    }
  };

  const handleSaveProject = async () => {
    if (!projectForm.titre || !projectForm.client_id) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectForm)
          .eq('id', editingProject.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectForm]);

        if (error) throw error;
      }

      setIsProjectModalOpen(false);
      resetProjectForm();
      fetchData();
    } catch (error) {
      alert('Une erreur est survenue');
    }
  };

  const handleSaveInvoice = async () => {
    if (!invoiceForm.montant || !invoiceForm.client_id) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const invoiceData = {
        numero_facture: invoiceForm.numero_facture || null,
        montant: parseFloat(invoiceForm.montant),
        statut: invoiceForm.statut,
        description: invoiceForm.description || null,
        client_id: invoiceForm.client_id,
        project_id: invoiceForm.project_id || null,
        due_date: invoiceForm.due_date || null,
        pdf_url: invoiceForm.pdf_url || null
      };

      if (editingInvoice) {
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', editingInvoice.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('invoices')
          .insert([invoiceData]);

        if (error) throw error;
      }

      setIsInvoiceModalOpen(false);
      resetInvoiceForm();
      fetchData();
    } catch (error: any) {
      alert('Erreur: ' + (error?.message || 'Une erreur est survenue'));
    }
  };

  const handleSendMessage = async () => {
    if (!messageForm.client_id || !messageForm.sujet || !messageForm.contenu) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const user = await getCurrentUser();
      if (!user) return;

      const { error } = await supabase
        .from('messages')
        .insert([{
          client_id: messageForm.client_id,
          admin_id: user.id,
          sujet: messageForm.sujet,
          contenu: messageForm.contenu
        }]);

      if (error) throw error;

      setIsMessageModalOpen(false);
      resetMessageForm();
      fetchData();
      alert('Message envoyé avec succès');
    } catch (error: any) {
      alert('Erreur: ' + (error?.message || 'Une erreur est survenue'));
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      alert('Une erreur est survenue');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      alert('Une erreur est survenue');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      alert('Une erreur est survenue');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-[#110F1B] to-[#1a0f3a] p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Dashboard Admin</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition border border-red-500/50 text-sm sm:text-base"
          >
            Déconnexion
          </button>
        </div>

        <div className="flex gap-2 sm:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition whitespace-nowrap ${
              activeTab === 'clients'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#0f0a20] text-gray-400 hover:text-white'
            }`}
          >
            Clients ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#0f0a20] text-gray-400 hover:text-white'
            }`}
          >
            Projets ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#0f0a20] text-gray-400 hover:text-white'
            }`}
          >
            Factures ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition whitespace-nowrap ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#0f0a20] text-gray-400 hover:text-white'
            }`}
          >
            Messages ({messages.length})
          </button>
        </div>

        {activeTab === 'clients' && (
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Liste des Clients</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#6F3FFF]/30">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nom</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Rôle</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-[#6F3FFF]/10 hover:bg-[#6F3FFF]/5">
                      <td className="py-3 px-4 text-white">
                        {client.nom} {client.prenom}
                      </td>
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
                      <td className="py-3 px-4">
                        <button
                          onClick={() => openEditClient(client)}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition"
                        >
                          <Edit size={18} />
                        </button>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Liste des Projets</h2>
              <button
                onClick={() => {
                  resetProjectForm();
                  setIsProjectModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg hover:opacity-90 transition"
              >
                <Plus size={20} />
                Nouveau Projet
              </button>
            </div>
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
                        Client: {project.clients?.nom} {project.clients?.prenom || ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => openEditProject(project)}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  {project.url && (
                    <p className="text-sm text-blue-400 mb-4">
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {project.url}
                      </a>
                    </p>
                  )}
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Liste des Factures</h2>
              <button
                onClick={() => {
                  resetInvoiceForm();
                  setIsInvoiceModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg hover:opacity-90 transition"
              >
                <Plus size={20} />
                Nouvelle Facture
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#6F3FFF]/30">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">N°</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Client</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Projet</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Montant</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Statut</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-[#6F3FFF]/10 hover:bg-[#6F3FFF]/5">
                      <td className="py-3 px-4 text-gray-300">{invoice.numero_facture || '-'}</td>
                      <td className="py-3 px-4 text-white">{invoice.clients?.nom || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-300">{invoice.projects?.titre || 'N/A'}</td>
                      <td className="py-3 px-4 text-white font-semibold">{invoice.montant.toFixed(2)} €</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(invoice.statut)}`}>
                          {invoice.statut === 'payee' ? 'Payée' : 'En Attente'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditInvoice(invoice)}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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

        {activeTab === 'messages' && (
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Messages Clients</h2>
              <button
                onClick={() => {
                  resetMessageForm();
                  setIsMessageModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg hover:opacity-90 transition"
              >
                <Send size={20} />
                Nouveau Message
              </button>
            </div>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="bg-[#0f0a20]/50 border border-[#6F3FFF]/20 rounded-lg p-6 hover:border-[#6F3FFF]/40 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{message.sujet}</h3>
                      <p className="text-gray-400 text-sm">
                        Pour: {message.clients?.nom} {message.clients?.prenom || ''}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(message.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        message.lu ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
                      }`}>
                        {message.lu ? 'Lu' : 'Non lu'}
                      </span>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap">{message.contenu}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-gray-400 text-center py-8">Aucun message pour le moment</p>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          resetClientForm();
        }}
        title={editingClient ? 'Modifier le client' : 'Nouveau client'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom *</label>
              <input
                type="text"
                value={clientForm.nom}
                onChange={(e) => setClientForm({ ...clientForm, nom: e.target.value })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
              <input
                type="text"
                value={clientForm.prenom}
                onChange={(e) => setClientForm({ ...clientForm, prenom: e.target.value })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
            <input
              type="email"
              value={clientForm.email}
              onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
            <input
              type="tel"
              value={clientForm.telephone}
              onChange={(e) => setClientForm({ ...clientForm, telephone: e.target.value })}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={clientForm.type}
                onChange={(e) => setClientForm({ ...clientForm, type: e.target.value })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              >
                <option value="particulier">Particulier</option>
                <option value="entreprise">Entreprise</option>
                <option value="association">Association</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Entreprise</label>
              <input
                type="text"
                value={clientForm.entreprise}
                onChange={(e) => setClientForm({ ...clientForm, entreprise: e.target.value })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSaveClient}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              {editingClient ? 'Mettre à jour' : 'Créer'}
            </button>
            <button
              onClick={() => {
                setIsClientModalOpen(false);
                resetClientForm();
              }}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-semibold"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          resetProjectForm();
        }}
        title={editingProject ? 'Modifier le projet' : 'Nouveau projet'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client *</label>
            <select
              value={projectForm.client_id}
              onChange={(e) => setProjectForm({ ...projectForm, client_id: e.target.value })}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              required
            >
              <option value="">Sélectionner un client</option>
              {clients.filter(c => c.role !== 'admin').map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nom} {client.prenom} - {client.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Titre *</label>
            <input
              type="text"
              value={projectForm.titre}
              onChange={(e) => setProjectForm({ ...projectForm, titre: e.target.value })}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">URL du site</label>
            <input
              type="url"
              value={projectForm.url}
              onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={projectForm.type}
                onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              >
                <option value="site_internet">Site Internet</option>
                <option value="ecommerce">E-commerce</option>
                <option value="application">Application</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
              <select
                value={projectForm.status}
                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              >
                <option value="en_attente">En Attente</option>
                <option value="en_cours">En Cours</option>
                <option value="termine">Terminé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Progression (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={projectForm.progress}
                onChange={(e) => setProjectForm({ ...projectForm, progress: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSaveProject}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              {editingProject ? 'Mettre à jour' : 'Créer'}
            </button>
            <button
              onClick={() => {
                setIsProjectModalOpen(false);
                resetProjectForm();
              }}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-semibold"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          resetInvoiceForm();
        }}
        title={editingInvoice ? 'Modifier la facture' : 'Nouvelle facture'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">N° Facture</label>
              <input
                type="text"
                value={invoiceForm.numero_facture}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, numero_facture: e.target.value })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
                placeholder="FAC-2024-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Montant (€) *</label>
              <input
                type="number"
                step="0.01"
                value={invoiceForm.montant}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, montant: e.target.value })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client *</label>
            <select
              value={invoiceForm.client_id}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, client_id: e.target.value })}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              required
            >
              <option value="">Sélectionner un client</option>
              {clients.filter(c => c.role !== 'admin').map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nom} {client.prenom} - {client.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Projet (optionnel)</label>
            <select
              value={invoiceForm.project_id}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, project_id: e.target.value })}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
            >
              <option value="">Aucun projet</option>
              {projects.filter(p => p.client_id === invoiceForm.client_id).map((project) => (
                <option key={project.id} value={project.id}>
                  {project.titre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={invoiceForm.description}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
              <select
                value={invoiceForm.statut}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, statut: e.target.value })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              >
                <option value="en_attente">En Attente</option>
                <option value="payee">Payée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date d'échéance</label>
              <input
                type="date"
                value={invoiceForm.due_date}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fichier PDF</label>
            {invoiceForm.pdf_url ? (
              <div className="flex items-center gap-2">
                <a 
                  href={invoiceForm.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30 transition text-center"
                >
                  Voir le PDF
                </a>
                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition"
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  disabled={uploadingPdf}
                  className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#6F3FFF] file:text-white file:cursor-pointer hover:file:bg-[#5F2FEF]"
                />
                {uploadingPdf && (
                  <p className="text-sm text-gray-400 mt-2">Upload en cours...</p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSaveInvoice}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              {editingInvoice ? 'Mettre à jour' : 'Créer'}
            </button>
            <button
              onClick={() => {
                setIsInvoiceModalOpen(false);
                resetInvoiceForm();
              }}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-semibold"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false);
          resetMessageForm();
        }}
        title="Envoyer un message"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client *</label>
            <select
              value={messageForm.client_id}
              onChange={(e) => setMessageForm({ ...messageForm, client_id: e.target.value })}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              required
            >
              <option value="">Sélectionner un client</option>
              {clients.filter(c => c.role !== 'admin').map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nom} {client.prenom} - {client.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sujet *</label>
            <input
              type="text"
              value={messageForm.sujet}
              onChange={(e) => setMessageForm({ ...messageForm, sujet: e.target.value })}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              placeholder="Mise à jour de votre projet"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
            <textarea
              value={messageForm.contenu}
              onChange={(e) => setMessageForm({ ...messageForm, contenu: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
              placeholder="Votre message ici..."
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSendMessage}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              <Send size={20} />
              Envoyer
            </button>
            <button
              onClick={() => {
                setIsMessageModalOpen(false);
                resetMessageForm();
              }}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-semibold"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
