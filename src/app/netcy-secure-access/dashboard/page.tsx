'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, signOut, getCurrentUser } from '@/lib/supabase';
import Modal from '@/components/Modal';
import { Plus, Edit, Trash2, Send } from 'lucide-react';
import Image from 'next/image';

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
    project_id: '',
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
    } catch (error) {
      alert('Erreur lors de l\'upload: ' + (error instanceof Error ? error.message : 'Une erreur est survenue'));
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
    } catch (error) {
      alert('Erreur lors de la suppression: ' + (error instanceof Error ? error.message : 'Une erreur est survenue'));
    }
  };

  const resetMessageForm = () => {
    setMessageForm({
      client_id: '',
      project_id: '',
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
    } catch {
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
    } catch {
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
    } catch (error) {
      alert('Erreur: ' + (error instanceof Error ? error.message : 'Une erreur est survenue'));
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
          project_id: messageForm.project_id || null,
          sujet: messageForm.sujet,
          contenu: messageForm.contenu
        }]);

      if (error) throw error;

      setIsMessageModalOpen(false);
      resetMessageForm();
      fetchData();
      alert('Message envoyé avec succès');
    } catch (error) {
      alert('Erreur: ' + (error instanceof Error ? error.message : 'Une erreur est survenue'));
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
    } catch {
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
    } catch {
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
    } catch {
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
    <>
      <div className="min-h-screen bg-[#0A061E] flex">
        {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0A061E] border-r border-white/[0.05] flex flex-col hidden md:flex shrink-0 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6F3FFF]/10 to-transparent pointer-events-none opacity-50"></div>
        <div className="p-6 relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-[#6F3FFF]/20">
              <Image src="/images/logo_tab.png" alt="Netcy Logo" width={40} height={40} className="object-contain" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin</h1>
          </div>

          <nav className="space-y-2 flex-grow">
            <button
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'clients'
                  ? 'bg-gradient-to-r from-[#6F3FFF]/20 to-transparent text-white border-l-2 border-[#6F3FFF]'
                  : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
              }`}
            >
              Clients
              <span className="ml-auto bg-white/[0.05] py-0.5 px-2 rounded-full text-xs">{clients.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-[#6F3FFF]/20 to-transparent text-white border-l-2 border-[#6F3FFF]'
                  : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
              }`}
            >
              Projets
              <span className="ml-auto bg-white/[0.05] py-0.5 px-2 rounded-full text-xs">{projects.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'invoices'
                  ? 'bg-gradient-to-r from-[#6F3FFF]/20 to-transparent text-white border-l-2 border-[#6F3FFF]'
                  : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
              }`}
            >
              Factures
              <span className="ml-auto bg-white/[0.05] py-0.5 px-2 rounded-full text-xs">{invoices.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-r from-[#6F3FFF]/20 to-transparent text-white border-l-2 border-[#6F3FFF]'
                  : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
              }`}
            >
              Messages
              <span className="ml-auto bg-white/[0.05] py-0.5 px-2 rounded-full text-xs">{messages.length}</span>
            </button>
          </nav>

          <div className="mt-auto">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative py-8 px-6 md:px-12 w-full">
        {/* Mobile Header / Nav (visible only on small screens) */}
        <div className="md:hidden mb-8">
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                 <Image src="/images/logo_tab.png" alt="Netcy Logo" width={32} height={32} className="object-contain" />
               </div>
               <h1 className="text-xl font-bold text-white tracking-tight">Admin</h1>
             </div>
             <button
               onClick={handleSignOut}
               className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-xs font-medium"
             >
               Déconnexion
             </button>
           </div>
           
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {/* Mobile tabs similar to old layout but styled better */}
              {['clients', 'projects', 'invoices', 'messages'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-[#6F3FFF]/20 text-white border border-[#6F3FFF]/30'
                      : 'bg-white/[0.02] border border-white/[0.05] text-gray-400'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 sm:p-10 relative overflow-y-auto w-full">
          {/* Top decorative glow in main area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#6F3FFF]/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto relative z-10 w-full">
          {/* Dashboard Header Content */}
          <header className="mb-10 hidden md:block">
             <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
               Tableau de bord
             </h2>
             <p className="text-gray-400 text-sm">
               Gérez vos clients, projets, factures et messages depuis cet espace sécurisé.
             </p>
          </header>

        {activeTab === 'clients' && (
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl shadow-xl overflow-hidden pt-6">
            <div className="px-6 sm:px-8 mb-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Tous les Clients</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.02] border-y border-white/[0.05]">
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Nom</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Email</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Type</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Rôle</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Inscription</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-6 sm:px-8 text-white font-medium">
                        {client.nom} {client.prenom}
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-gray-400 group-hover:text-gray-300 transition-colors">
                        {client.email}
                      </td>
                      <td className="py-4 px-6 sm:px-8">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {client.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 sm:px-8">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                          client.role === 'admin' 
                            ? 'bg-[#6F3FFF]/10 text-[#8A6FFF] border-[#6F3FFF]/20' 
                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {client.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-gray-500">
                        {new Date(client.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-6 sm:px-8">
                        <button
                          onClick={() => openEditClient(client)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-all"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length === 0 && (
                <div className="p-12 text-center text-gray-500 bg-white/[0.01]">
                  Aucun client pour le moment
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">Tous les Projets</h3>
              <button
                onClick={() => {
                  resetProjectForm();
                  setIsProjectModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6F3FFF] to-[#43209E] text-white rounded-lg hover:shadow-[0_0_15px_rgba(111,63,255,0.4)] transition-all duration-300 text-sm font-medium"
              >
                <Plus size={16} />
                Nouveau
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#6F3FFF]/5 to-transparent rounded-bl-full pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="pr-4">
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#8A6FFF] transition-colors">{project.titre}</h4>
                      <p className="text-xs font-medium text-gray-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                        {project.clients?.nom} {project.clients?.prenom || ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${
                         project.status === 'en_cours' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                         project.status === 'termine' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                         'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-grow">{project.description}</p>
                  
                  <div className="mt-auto relative z-10">
                    {project.url && (
                      <p className="text-xs text-[#8A6FFF] mb-4 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[#A78BFA] transition-colors truncate">
                          {project.url}
                        </a>
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="w-full bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#6F3FFF] to-[#43209E] h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-300 w-8 text-right">{project.progress}%</span>
                    </div>
                    
                    <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditProject(project)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-all"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {projects.length === 0 && (
              <div className="p-12 text-center text-gray-500 bg-white/[0.01] rounded-xl mt-4 border border-dashed border-white/[0.1]">
                Aucun projet pour le moment
              </div>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl shadow-xl overflow-hidden pt-6">
            <div className="px-6 sm:px-8 mb-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Toutes les Factures</h3>
              <button
                onClick={() => {
                  resetInvoiceForm();
                  setIsInvoiceModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6F3FFF] to-[#43209E] text-white rounded-lg hover:shadow-[0_0_15px_rgba(111,63,255,0.4)] transition-all duration-300 text-sm font-medium"
              >
                <Plus size={16} />
                Nouvelle
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.02] border-y border-white/[0.05]">
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">N°</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Client</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Projet</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Montant</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Statut</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Date</th>
                    <th className="text-left py-4 px-6 sm:px-8 text-gray-400 font-medium tracking-wide uppercase text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-6 sm:px-8 text-gray-400 font-medium">{invoice.numero_facture || '-'}</td>
                      <td className="py-4 px-6 sm:px-8 text-white font-medium">{invoice.clients?.nom || 'N/A'}</td>
                      <td className="py-4 px-6 sm:px-8 text-gray-400 group-hover:text-gray-300 transition-colors">{invoice.projects?.titre || 'N/A'}</td>
                      <td className="py-4 px-6 sm:px-8">
                        <span className="text-white font-bold">{invoice.montant.toFixed(2)}</span>
                        <span className="text-gray-500 ml-1">€</span>
                      </td>
                      <td className="py-4 px-6 sm:px-8">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${
                          invoice.statut === 'payee' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`}>
                          {invoice.statut === 'payee' ? 'Payée' : 'En Attente'}
                        </span>
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-gray-500">
                        {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-6 sm:px-8">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditInvoice(invoice)}
                            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-all"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {invoices.length === 0 && (
                <div className="p-12 text-center text-gray-500 bg-white/[0.01]">
                  Aucune facture pour le moment
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl shadow-xl overflow-hidden pt-6">
            <div className="px-6 sm:px-8 mb-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Messages Clients</h3>
              <button
                onClick={() => {
                  resetMessageForm();
                  setIsMessageModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6F3FFF] to-[#43209E] text-white rounded-lg hover:shadow-[0_0_15px_rgba(111,63,255,0.4)] transition-all duration-300 text-sm font-medium"
              >
                <Send size={16} />
                Nouveau Message
              </button>
            </div>
            
            <div className="divide-y divide-white/[0.05]">
              {messages.map((message) => (
                <div key={message.id} className="p-6 sm:px-8 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-semibold text-white group-hover:text-[#8A6FFF] transition-colors">
                          {message.sujet}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          message.lu 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-[#6F3FFF]/10 text-[#8A6FFF] border-[#6F3FFF]/20'
                        }`}>
                          {message.lu ? 'Lu' : 'Nouveau'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-400 mt-1">
                        De: <span className="text-gray-300">{message.clients?.nom} {message.clients?.prenom || ''}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-500 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/[0.05] relative z-10">
                        {new Date(message.created_at).toLocaleString('fr-FR', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute:'2-digit'
                        })}
                      </span>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all sm:opacity-0 group-hover:opacity-100 relative z-10"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm bg-white/[0.01] border border-white/[0.02] p-4 rounded-xl relative z-0 mt-4">
                    <p className="whitespace-pre-wrap leading-relaxed">{message.contenu}</p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="p-12 text-center text-gray-500 bg-white/[0.01]">
                  Aucun message pour le moment
                </div>
              )}
            </div>
          </div>
        )}
          </div>
        </div>
      </main>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Date d&apos;échéance</label>
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
              onChange={(e) => setMessageForm({ ...messageForm, client_id: e.target.value, project_id: '' })}
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
              value={messageForm.project_id}
              onChange={(e) => setMessageForm({ ...messageForm, project_id: e.target.value })}
              className="w-full px-4 py-2 bg-[#060010] border border-[#6F3FFF]/30 rounded-lg text-white focus:outline-none focus:border-[#6F3FFF]"
            >
              <option value="">Message général (non lié à un projet)</option>
              {messageForm.client_id && projects.filter(p => p.client_id === messageForm.client_id).map((project) => (
                <option key={project.id} value={project.id}>
                  {project.titre}
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
    </>
  );
}
