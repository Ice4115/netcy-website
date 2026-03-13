'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, signOut, getCurrentUser } from '@/lib/supabase';
import Modal from '@/components/Modal';
import { Plus, Edit, Trash2, Send, MapPin, Mail, Phone, Globe, Linkedin, Download } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'clients' | 'projects' | 'invoices' | 'messages' | 'cv'>('clients');
  
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

  const handleDownloadCV = () => {
    const photoUrl = window.location.origin + '/images/profile.png';
    const htmlContent = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>CV - Jung Jean-Marie</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" />
<style>
* { margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important; }
body{font-family:'Segoe UI',Arial,sans-serif;background:white;}
.cv{width:210mm;min-height:297mm;margin:0 auto;display:flex;flex-direction:column;}
.header{display:flex;align-items:center;gap:28px;background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%);padding:28px 36px;}
.photo-ring{width:112px;height:112px;border-radius:50%;border:3px solid #6F3FFF;padding:3px;flex-shrink:0;}
.photo{width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:center 20%;display:block;}
.header-name{font-size:33px;font-weight:800;color:white;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;}
.header-sub{font-size:12px;color:#a5b4fc;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;}
.header-badge{display:inline-block;background:#6F3FFF;color:white;font-size:11.5px;font-weight:700;padding:5px 14px;border-radius:20px;}
.body{display:flex;flex:1;}
.left-col{width:34%;background:#f1f5f9;padding:26px 20px;}
.right-col{width:66%;background:white;padding:22px 24px;border-left:1px solid #e2e8f0;}
.sec-title{font-size:10.5px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#6F3FFF;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.sec-title::after{content:'';flex:1;height:1px;background:#cbd5e1;}
.section{margin-bottom:24px;}
.contact-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;}
.c-icon{width:16px;flex-shrink:0;text-align:center;color:#6F3FFF;font-size:13px;margin-top:2px;}
.c-text{font-size:12px;color:#334155;line-height:1.5;word-break:break-all;}
.skill-tag{font-size:11.5px;background:#1e293b;color:white;padding:4px 10px;border-radius:4px;font-weight:500;display:inline-block;margin:3px;}
.soft-tag{font-size:11.5px;background:#ede9fe;color:#5b21b6;padding:4px 10px;border-radius:4px;font-weight:600;display:inline-block;margin:3px;}
.tl-item{position:relative;padding-left:22px;margin-bottom:14px;}
.tl-dot{position:absolute;left:0;top:4px;width:11px;height:11px;border-radius:50%;background:#6F3FFF;border:2px solid white;box-shadow:0 0 0 2px #6F3FFF;}
.tl-dot.stage{background:#0ea5e9;box-shadow:0 0 0 2px #0ea5e9;}
.exp-title{font-size:13px;font-weight:700;color:#0f172a;}
.exp-badge{display:inline-block;font-size:9.5px;font-weight:700;background:#0ea5e9;color:white;padding:1px 5px;border-radius:3px;margin-left:5px;vertical-align:middle;}
.exp-co{font-size:11px;color:#6F3FFF;font-weight:600;margin:2px 0;text-transform:uppercase;letter-spacing:0.5px;}
.exp-date{font-size:10.5px;color:#94a3b8;margin-bottom:3px;}
.exp-desc{font-size:11.5px;color:#64748b;line-height:1.5;}
.proj-item{margin-bottom:12px;padding-left:10px;border-left:2px solid #6F3FFF;}
.proj-title{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:2px;}
.proj-sub{font-size:11.5px;font-weight:600;color:#6F3FFF;margin-bottom:2px;}
.proj-desc{font-size:11.5px;color:#64748b;line-height:1.5;}
.profile-text{font-size:12px;color:#475569;line-height:1.8;}
.edu-item{margin-bottom:16px;}
.edu-degree{font-size:13px;font-weight:700;color:#0f172a;}
.edu-school{font-size:11.5px;color:#64748b;margin-top:3px;}
.edu-year{display:inline-block;font-size:10.5px;color:#6F3FFF;background:#ede9fe;padding:2px 9px;border-radius:10px;margin-top:5px;font-weight:600;}
@media print{@page{margin:0;size:A4 portrait;}body{margin:0;}.cv{width:100%;}}
</style></head>
<body><div class="cv">
<div class="header">
  <div class="photo-ring"><img class="photo" src="${photoUrl}" alt="Jung Jean-Marie" /></div>
  <div>
    <div class="header-name">Jung Jean-Marie</div>
    <div class="header-sub">BTS SIO &middot; Option SISR &middot; Major de promotion &middot; 23 ans</div>
    <div class="header-badge">En recherche d'une alternance &mdash; BTS SIO SISR</div>
  </div>
</div>
<div class="body">
  <div class="left-col">
    <div class="section"><div class="sec-title">Contact</div>
      <div class="contact-row"><span class="c-icon"><i class="fas fa-map-marker-alt"></i></span><span class="c-text">3 Rue des Soldats, 34000 Montpellier</span></div>
      <div class="contact-row"><span class="c-icon"><i class="fas fa-envelope"></i></span><span class="c-text">jeanmarie.jung.pro@gmail.com</span></div>
      <div class="contact-row"><span class="c-icon"><i class="fas fa-phone"></i></span><span class="c-text">07 49 64 44 78</span></div>
      <div class="contact-row"><span class="c-icon"><i class="fas fa-globe"></i></span><span class="c-text">netcy.fr</span></div>
      <div class="contact-row"><span class="c-icon"><i class="fab fa-linkedin"></i></span><span class="c-text">linkedin.com/in/jean-marie-jung-40683b218</span></div>
    </div>
    <div class="section"><div class="sec-title">Formation</div>
      <div class="edu-item"><div class="edu-degree">BTS SIO &ndash; SISR</div><div class="edu-school">EPSI Montpellier</div><div class="edu-year">2024 &ndash; 2026 (en cours)</div></div>
      <div class="edu-item"><div class="edu-degree">Baccalaur&eacute;at G&eacute;n&eacute;ral S</div><div class="edu-school">Lyc&eacute;e Polyvalent Philippe de Girard</div><div class="edu-year">2017 &ndash; 2021</div></div>
    </div>
    <div class="section"><div class="sec-title">Comp&eacute;tences</div>
      <div><span class="skill-tag">PHP</span><span class="skill-tag">SQL</span><span class="skill-tag">HTML/CSS/JS</span><span class="skill-tag">Python</span><span class="skill-tag">C++</span><span class="skill-tag">Next.js/React</span><span class="skill-tag">R&eacute;seaux &amp; Infra</span><span class="skill-tag">Cybers&eacute;curit&eacute;</span></div>
    </div>
    <div class="section"><div class="sec-title">Soft Skills</div>
      <div><span class="soft-tag">Autonomie</span><span class="soft-tag">Travail en &eacute;quipe</span><span class="soft-tag">Polyvalence</span><span class="soft-tag">Entrepreneuriat</span></div>
    </div>
  </div>
  <div class="right-col">
    <div class="section"><div class="sec-title">Profil</div>
      <p class="profile-text">Pratiquant le Viet Vo Dao depuis 9 ans, j'ai développé rigueur, discipline et esprit d'équipe. Étudiant en 2e année à l'EPSI en BTS SIO option SISR et major de ma promotion. Orienté vers les réseaux et la cybersécurité, je suis à la recherche d'une alternance.</p>
    </div>
    <div class="section"><div class="sec-title">Exp&eacute;riences</div>
      <div class="tl-item"><div class="tl-dot stage"></div><div class="exp-title">Stage &ndash; Technicien Informatique <span class="exp-badge">STAGE</span></div><div class="exp-co">Devensys Cybers&eacute;curit&eacute; &middot; Montpellier</div><div class="exp-date">19 janvier 2026 &ndash; 20 f&eacute;vrier 2026</div><div class="exp-desc">D&eacute;ploiement de PC, journées d&eacute;couverte, mise en place d'un serveur PKI.</div></div>
      <div class="tl-item"><div class="tl-dot stage"></div><div class="exp-title">Stage &ndash; Technicien Informatique <span class="exp-badge">STAGE</span></div><div class="exp-co">Infoboost &middot; Mauguio</div><div class="exp-date">23 avril 2025 &ndash; 4 juillet 2025</div><div class="exp-desc">Reconditionnement de PC, infog&eacute;rance.</div></div>
      <div class="tl-item"><div class="tl-dot"></div><div class="exp-title">Vendeur &ndash; Polyvalent</div><div class="exp-co">Boulangerie Paul &middot; Saint-R&eacute;my-de-Provence</div><div class="exp-date">Sept. 2023 &ndash; Juin 2024 &middot; CDI</div></div>
    </div>
    <div class="section"><div class="sec-title">Projets R&eacute;alis&eacute;s</div>
      <div class="proj-item"><div class="proj-title">NETCY &ndash; Micro-entreprise</div><div class="proj-sub">Création de sites web s&eacute;curis&eacute;s</div><div class="proj-desc">Site vitrine Next.js/React/TypeScript sp&eacute;cialis&eacute; en cybers&eacute;curit&eacute;.</div></div>
      <div class="proj-item"><div class="proj-title">H&ocirc;tel Neptune</div><div class="proj-desc">Application web h&ocirc;teli&egrave;re &ndash; PHP, MySQL, Bootstrap.</div></div>
      <div class="proj-item"><div class="proj-title">E-Commerce &ndash; Le Seigneur des Goodies</div><div class="proj-desc">Boutique en ligne &ndash; PHP, MySQL, JS.</div></div>
    </div>
  </div>
</div>
</div></body></html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => {
        setTimeout(() => { win.print(); URL.revokeObjectURL(url); }, 500);
      };
    }
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
          <button
            onClick={() => setActiveTab('cv')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition whitespace-nowrap ${
              activeTab === 'cv'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#0f0a20] text-gray-400 hover:text-white'
            }`}
          >
            Mon CV
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

        {activeTab === 'cv' && (
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Mon CV</h2>
              <button
                onClick={handleDownloadCV}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white rounded-lg hover:opacity-90 transition"
              >
                <Download size={18} />
                Télécharger / Imprimer
              </button>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl" style={{ maxWidth: '900px', margin: '0 auto', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '28px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', padding: '28px 36px' }}>
                <div style={{ width: '112px', height: '112px', borderRadius: '50%', border: '3px solid #6F3FFF', padding: '3px', flexShrink: 0 }}>
                  <img src="/images/profile.png" alt="Jung Jean-Marie" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '33px', fontWeight: 800, color: 'white', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '4px' }}>Jung Jean-Marie</div>
                  <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>BTS SIO · Option SISR · Major de promotion · 23 ans</div>
                  <div style={{ display: 'inline-block', background: '#6F3FFF', color: 'white', fontSize: '11.5px', fontWeight: 700, padding: '5px 14px', borderRadius: '20px', letterSpacing: '0.5px' }}>En recherche d&apos;une alternance — BTS SIO SISR</div>
                </div>
              </div>
              <div style={{ display: 'flex', minHeight: '580px' }}>
                <div style={{ width: '34%', background: '#f1f5f9', padding: '26px 20px', display: 'flex', flexDirection: 'column' }}>
                  {([
                    { title: 'Contact', content: (
                      <div>
                        {([
                          { icon: <MapPin size={15} strokeWidth={2} />, text: '3 Rue des Soldats, 34000 Montpellier' },
                          { icon: <Mail size={15} strokeWidth={2} />, text: 'jeanmarie.jung.pro@gmail.com' },
                          { icon: <Phone size={15} strokeWidth={2} />, text: '07 49 64 44 78' },
                          { icon: <Globe size={15} strokeWidth={2} />, text: 'netcy.fr' },
                          { icon: <Linkedin size={15} strokeWidth={2} />, text: 'linkedin.com/in/jean-marie-jung-40683b218' },
                        ] as { icon: React.ReactNode; text: string }[]).map((c, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ color: '#6F3FFF', flexShrink: 0, marginTop: '1px' }}>{c.icon}</div>
                            <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5, wordBreak: 'break-all' }}>{c.text}</div>
                          </div>
                        ))}
                      </div>
                    )},
                    { title: 'Formation', content: (
                      <>
                        {[
                          { deg: 'BTS SIO – SISR', school: 'EPSI Montpellier', year: '2024 – 2026 (en cours)' },
                          { deg: 'Baccalauréat Général S', school: 'Lycée Polyvalent Philippe de Girard', year: '2017 – 2021' },
                        ].map((e, i) => (
                          <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{e.deg}</div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px' }}>{e.school}</div>
                            <div style={{ display: 'inline-block', fontSize: '10.5px', color: '#6F3FFF', background: '#ede9fe', padding: '2px 9px', borderRadius: '10px', marginTop: '5px', fontWeight: 600 }}>{e.year}</div>
                          </div>
                        ))}
                      </>
                    )},
                    { title: 'Compétences', content: (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['PHP', 'SQL', 'HTML/CSS/JS', 'Python', 'C++', 'Next.js/React', 'Réseaux & Infra', 'Cybersécurité'].map((s, i) => (
                          <div key={i} style={{ fontSize: '11.5px', background: '#1e293b', color: 'white', padding: '4px 10px', borderRadius: '4px', fontWeight: 500 }}>{s}</div>
                        ))}
                      </div>
                    )},
                    { title: 'Soft Skills', content: (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['Autonomie', 'Travail en équipe', 'Polyvalence', 'Entrepreneuriat'].map((s, i) => (
                          <div key={i} style={{ fontSize: '11.5px', background: '#ede9fe', color: '#5b21b6', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>{s}</div>
                        ))}
                      </div>
                    )},
                  ] as { title: string; content: React.ReactNode }[]).map((sec, i) => (
                    <div key={i} style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: '#6F3FFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {sec.title}<div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
                      </div>
                      {sec.content}
                    </div>
                  ))}
                </div>
                <div style={{ width: '66%', background: 'white', padding: '22px 24px', borderLeft: '1px solid #e2e8f0' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: '#6F3FFF', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Profil<div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.8 }}>
                      Pratiquant le Viet Vo Dao depuis 9 ans, j&apos;ai développé rigueur, discipline et esprit d&apos;équipe. Étudiant en deuxième année à l&apos;EPSI en BTS SIO option SISR et major de ma promotion. Orienté vers les réseaux et la cybersécurité, je suis actuellement à la recherche d&apos;une alternance pour mon BTS SIO SISR.
                    </p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: '#6F3FFF', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Expériences<div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
                    </div>
                    {[
                      { title: 'Stage – Technicien Informatique', stage: true, co: 'Devensys Cybersécurité · Montpellier', date: '19 janvier 2026 – 20 février 2026', desc: "Déploiement de PC, journées découverte, mise en place d'un serveur PKI." },
                      { title: 'Stage – Technicien Informatique', stage: true, co: 'Infoboost · Mauguio', date: '23 avril 2025 – 4 juillet 2025', desc: 'Reconditionnement de PC, infogérance.' },
                      { title: 'Vendeur – Polyvalent', stage: false, co: 'Boulangerie Paul · Saint-Rémy-de-Provence', date: 'Sept. 2023 – Juin 2024 · CDI', desc: null },
                    ].map((exp, i, arr) => (
                      <div key={i} style={{ position: 'relative', paddingLeft: '22px', marginBottom: '14px' }}>
                        {i < arr.length - 1 && <div style={{ position: 'absolute', left: '5px', top: '16px', width: '1px', height: 'calc(100% + 2px)', background: '#e2e8f0' }}></div>}
                        <div style={{ position: 'absolute', left: 0, top: '4px', width: '11px', height: '11px', borderRadius: '50%', background: exp.stage ? '#0ea5e9' : '#6F3FFF', border: '2px solid white', boxShadow: `0 0 0 2px ${exp.stage ? '#0ea5e9' : '#6F3FFF'}` }}></div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                          {exp.title}
                          {exp.stage && <span style={{ display: 'inline-block', fontSize: '9.5px', fontWeight: 700, background: '#0ea5e9', color: 'white', padding: '1px 5px', borderRadius: '3px', marginLeft: '5px', verticalAlign: 'middle' }}>STAGE</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6F3FFF', fontWeight: 600, margin: '2px 0', textTransform: 'uppercase' }}>{exp.co}</div>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8', marginBottom: '3px' }}>{exp.date}</div>
                        {exp.desc && <div style={{ fontSize: '11.5px', color: '#64748b', lineHeight: 1.5 }}>{exp.desc}</div>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: '#6F3FFF', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Projets Réalisés<div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
                    </div>
                    {[
                      { title: 'NETCY – Micro-entreprise', sub: 'Création de sites web sécurisés', desc: 'Site vitrine Next.js/React/TypeScript spécialisé en cybersécurité réseau.' },
                      { title: "Création d'un site – Hôtel Neptune", sub: null, desc: 'Application web hôtelière — PHP, MySQL, Bootstrap.' },
                      { title: "E-Commerce — Le Seigneur des Goodies", sub: null, desc: 'Boutique en ligne — PHP, MySQL, JS.' },
                    ].map((p, i) => (
                      <div key={i} style={{ marginBottom: '12px', paddingLeft: '10px', borderLeft: '2px solid #6F3FFF' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{p.title}</div>
                        {p.sub && <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#6F3FFF', marginBottom: '2px' }}>{p.sub}</div>}
                        <div style={{ fontSize: '11.5px', color: '#64748b', lineHeight: 1.5 }}>{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
    </div>
  );
}
