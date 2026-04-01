'use client';

import { useState, useEffect, useRef, useMemo, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, signOut, getCurrentUser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from '@tanstack/react-table';
import { Bar, BarChart, XAxis } from 'recharts';
import { NotificationList } from '@/components/animate-ui/components/community/notification-list';
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import { motion, type Variants } from 'motion/react';
import { ProfilePanel } from '@/components/profile-panel';
import { BotIcon } from '@/components/animate-ui/icons/bot';
import {
  LayoutDashboard, FolderOpen, FileText, Users, MessageSquare,
  BarChart2, HelpCircle, LogOut, Plus, Edit2, Trash2,
  Send, Search, Filter, Bell,
  ChevronLeft, ChevronRight, X as XIcon, Eye, Upload,
} from 'lucide-react';

/* ── Types ── */
interface Client  { id: string; nom: string; prenom?: string; email: string; type: string; role: string; entreprise?: string; created_at: string; }
interface Project { id: string; titre: string; description: string; status: string; progress: number; client_id: string; created_at: string; clients?: { nom: string; prenom?: string }; }
interface Invoice { id: string; numero_facture?: string; montant: number; statut: string; description?: string; client_id: string; created_at: string; pdf_url?: string; clients?: { nom: string }; }
interface Message { id: string; project_id: string; auteur: 'admin' | 'client'; message: string; created_at: string; }
interface AdminNotif { id: string; clientName: string; preview: string; time: string; clientId: string; }

/* ── Chart data ── */
const revenueData = [
  { month: 'Jan', revenue: 1200 }, { month: 'Fév', revenue: 2800 },
  { month: 'Mar', revenue: 1900 }, { month: 'Avr', revenue: 3400 },
  { month: 'Mai', revenue: 2600 }, { month: 'Jun', revenue: 4200 },
];
const chartConfig: ChartConfig = { revenue: { label: 'Revenus (€)', color: '#0052FF' } };

type ProjectRow = { id: string; titre: string; progress: number; status: string; client: string };
const projectColumns: ColumnDef<ProjectRow>[] = [
  { accessorKey: 'titre',    header: 'PROJET' },
  { accessorKey: 'client',   header: 'CLIENT' },
  { accessorKey: 'progress', header: 'JALON' },
  { accessorKey: 'status',   header: 'ÉTAT' },
];

const NAV = [
  { label: 'Dashboard', section: 'dashboard', icon: LayoutDashboard },
  { label: 'Projets',   section: 'projects',  icon: FolderOpen },
  { label: 'Factures',  section: 'invoices',  icon: FileText },
  { label: 'Clients',   section: 'clients',   icon: Users },
  { label: 'Messages',  section: 'messages',  icon: MessageSquare },
];

const PAGE_SIZE = 10;

/* ── ManagementBar ── */
const BTN_MOTION = {
  initial: 'rest', whileHover: 'hover', whileTap: 'tap',
  variants: {
    rest: { maxWidth: '40px' },
    hover: { maxWidth: '180px', transition: { type: 'spring' as const, stiffness: 200, damping: 35, delay: 0.1 } },
    tap: { scale: 0.95 },
  },
  transition: { type: 'spring' as const, stiffness: 250, damping: 25 },
} as const;

const LABEL_V: Variants = {
  rest: { opacity: 0, x: 4 },
  hover: { opacity: 1, x: 0, visibility: 'visible' },
};
const LABEL_T = { type: 'spring' as const, stiffness: 200, damping: 25 };

function AdminManagementBar({
  totalPages, currentPage, onPageChange,
  onAdd, onEdit, onDelete,
  addLabel, editLabel, deleteLabel, hasSelection,
}: {
  totalPages: number; currentPage: number; onPageChange: (p: number) => void;
  onAdd: () => void; onEdit: () => void; onDelete: () => void;
  addLabel: string; editLabel: string; deleteLabel: string; hasSelection: boolean;
}) {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl border border-surface-container bg-surface-container-lowest p-2 shadow-md">
      <button disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}
        className="p-1.5 rounded-lg text-outline hover:text-on-surface disabled:text-outline-variant disabled:cursor-not-allowed transition-colors">
        <ChevronLeft size={16} />
      </button>
      <div className="flex items-center gap-1 text-sm tabular-nums text-on-surface px-1 min-w-[52px] justify-center">
        <SlidingNumber padStart number={currentPage} />
        <span className="text-outline">/ {totalPages || 1}</span>
      </div>
      <button disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}
        className="p-1.5 rounded-lg text-outline hover:text-on-surface disabled:text-outline-variant disabled:cursor-not-allowed transition-colors">
        <ChevronRight size={16} />
      </button>
      <div className="mx-1.5 h-6 w-px bg-surface-container rounded-full" />
      <motion.div layout layoutRoot className="flex gap-1.5">
        <motion.button {...BTN_MOTION} onClick={onAdd}
          className="flex h-9 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-xl bg-blue-50 dark:bg-[#1a1f3d] px-2.5 text-primary dark:text-[#d0bcff]">
          <Plus size={16} className="shrink-0" />
          <motion.span variants={LABEL_V} transition={LABEL_T} className="invisible text-sm font-medium pr-1">{addLabel}</motion.span>
        </motion.button>
        <motion.button {...BTN_MOTION} onClick={hasSelection ? onEdit : undefined}
          className={`flex h-9 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-xl px-2.5 transition-colors
            ${hasSelection ? 'bg-surface-container-low text-on-surface-variant cursor-pointer' : 'bg-surface text-outline-variant cursor-not-allowed'}`}>
          <Edit2 size={16} className="shrink-0" />
          <motion.span variants={LABEL_V} transition={LABEL_T} className="invisible text-sm font-medium pr-1">{editLabel}</motion.span>
        </motion.button>
        <motion.button {...BTN_MOTION} onClick={hasSelection ? onDelete : undefined}
          className={`flex h-9 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-xl px-2.5 transition-colors
            ${hasSelection ? 'bg-red-50 dark:bg-[#450A0A] text-red-600 dark:text-red-400 cursor-pointer' : 'bg-surface text-outline-variant cursor-not-allowed'}`}>
          <Trash2 size={16} className="shrink-0" />
          <motion.span variants={LABEL_V} transition={LABEL_T} className="invisible text-sm font-medium pr-1">{deleteLabel}</motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ── Modal ── */
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-low">
          <h2 className="font-display font-bold text-lg text-on-surface">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors">
            <XIcon size={16} className="text-outline" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function PdfViewerModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-low flex-shrink-0">
          <h2 className="font-display font-bold text-lg text-on-surface truncate">{title}</h2>
          <div className="flex items-center gap-2">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs btn-ghost rounded-xl flex items-center gap-1.5">
              <Eye size={12} /> Ouvrir dans un onglet
            </a>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors">
              <XIcon size={16} className="text-outline" />
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          <iframe src={url} className="w-full h-full rounded-xl border border-surface-container-low" title={title} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
const inputCls = "w-full bg-surface border border-surface-container rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#d0bcff]/20 focus:border-primary dark:focus:border-[#d0bcff] transition-colors placeholder-[#C3C6CF]";

/* ── Badge helpers ── */
function statusBadge(s: string) {
  if (s === 'en_cours')   return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">EN COURS</span>;
  if (s === 'en_attente') return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">EN ATTENTE</span>;
  if (s === 'termine')    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">TERMINÉ</span>;
  return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-container-low text-outline">{s}</span>;
}
function invoiceBadge(s: string) {
  if (s === 'payée' || s === 'payee')    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">PAYÉE</span>;
  if (s === 'envoyée' || s === 'envoye') return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">ENVOYÉE</span>;
  if (s === 'en_attente')                return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">EN ATTENTE</span>;
  return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-container-low text-outline">{s.toUpperCase()}</span>;
}

/* ── NotifBell : composant isolé pour éviter de re-rendre tout le dashboard ── */
function NotifBell({ adminNotifs, onOpenChat, onViewAll, onDismiss }: {
  adminNotifs: AdminNotif[];
  onOpenChat: (clientId: string) => void;
  onViewAll: () => void;
  onDismiss: (clientId: string) => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen) return;
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [notifOpen]);

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setNotifOpen(o => !o)}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest border border-surface-container-low hover:bg-surface-container-low transition-colors"
      >
        <Bell size={16} className="text-on-surface-variant" />
        {adminNotifs.length > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 dark:bg-red-500 rounded-full border-2 border-surface-container-lowest animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 dark:bg-red-500 rounded-full border-2 border-surface-container-lowest" />
          </>
        )}
      </button>
      {notifOpen && (
        <div className="absolute right-0 top-12 z-50 animate-fade-up">
          <NotificationList
            notifications={adminNotifs.map(n => ({
              id: n.clientId,
              title: n.clientName,
              subtitle: n.preview,
              time: n.time,
            }))}
            onItemClick={(clientId) => {
              onOpenChat(clientId);
              setNotifOpen(false);
            }}
            onViewAll={() => { onViewAll(); setNotifOpen(false); }}
            onDismiss={onDismiss}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading]             = useState(true);
  const [activeSection, setActiveSectionRaw] = useState('dashboard');
  const [isPending, startTransition]     = useTransition();
  const setActiveSection = useCallback((s: string) => startTransition(() => setActiveSectionRaw(s)), []);
  const [clients, setClients]             = useState<Client[]>([]);
  const [projects, setProjects]           = useState<Project[]>([]);
  const [invoices, setInvoices]           = useState<Invoice[]>([]);
  const [adminId, setAdminId]             = useState('');

  /* Pagination */
  const [projectPage, setProjectPage] = useState(1);
  const [invoicePage, setInvoicePage] = useState(1);
  const [clientPage,  setClientPage]  = useState(1);

  /* Selection */
  const [selProjectId, setSelProjectId] = useState<string | null>(null);
  const [selInvoiceId, setSelInvoiceId] = useState<string | null>(null);
  const [selClientId,  setSelClientId]  = useState<string | null>(null);

  /* Modals */
  const [projectModal, setProjectModal] = useState<{ open: boolean; mode: 'add' | 'edit' }>({ open: false, mode: 'add' });
  const [invoiceModal, setInvoiceModal] = useState<{ open: boolean; mode: 'add' | 'edit' }>({ open: false, mode: 'add' });
  const [clientModal,  setClientModal]  = useState<{ open: boolean; mode: 'add' | 'edit' }>({ open: false, mode: 'add' });

  /* Forms */
  const [pForm, setPForm] = useState({ titre: '', description: '', status: 'en_attente', progress: 0, client_id: '' });
  const [iForm, setIForm] = useState({ numero_facture: '', montant: 0, statut: 'en_attente', description: '', client_id: '' });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null);
  const [pdfViewTitle, setPdfViewTitle] = useState('');
  const [cForm, setCForm] = useState({ nom: '', prenom: '', email: '', entreprise: '', type: 'particulier', role: 'client' });

  /* Filters */
  const [clientSearch, setClientSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  /* Messages */
  const [chatClientId, setChatClientId] = useState<string | null>(null);
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [msgInput,    setMsgInput]    = useState('');
  const [sending,     setSending]     = useState(false);
  const [chatProjectId, setChatProjectId] = useState<string>('');
  const [chatProjects,  setChatProjects]  = useState<{id:string;titre:string}[]>([]);

  /* Notifs */
  const [adminNotifs, setAdminNotifs] = useState<AdminNotif[]>([]);
  const unreadNotifs = adminNotifs.length;

  /* Profile */
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminAvatarUrl, setAdminAvatarUrl] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* Refs stables pour éviter les closures périmées dans les callbacks real-time */
  const adminIdRef      = useRef('');
  const projectsRef     = useRef<Project[]>([]);
  const clientsRef      = useRef<Client[]>([]);
  const chatProjectIdRef = useRef<string>('');

  /* ── Init ── */
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const user = await getCurrentUser();
      if (cancelled) return;
      if (!user) { router.push('/connexion'); return; }
      const { data: cd } = await supabase.from('clients').select('role, avatar_url').eq('id', user.id).single();
      if (cancelled) return;
      if (!cd || cd.role !== 'admin') { router.push('/client'); return; }
      setAdminId(user.id);
      adminIdRef.current = user.id;
      if (cd.avatar_url) setAdminAvatarUrl(cd.avatar_url);

      /* Charger les notifications initiales : derniers messages clients non lus */
      const { data: allClients } = await supabase.from('clients').select('id, nom, prenom').neq('role', 'admin');
      const { data: allProjects } = await supabase.from('projects').select('id, client_id');
      if (cancelled) return;

      if (allClients && allProjects) {
        const projIds = allProjects.map(p => p.id);
        if (projIds.length > 0) {
          const { data: recentMsgs } = await supabase
            .from('project_messages')
            .select('*')
            .eq('auteur', 'client')
            .in('project_id', projIds)
            .order('created_at', { ascending: false })
            .limit(20);
          if (cancelled) return;

          if (recentMsgs && recentMsgs.length > 0) {
            const seen = new Set<string>();
            const notifs: AdminNotif[] = [];
            for (const msg of recentMsgs) {
              const proj = allProjects.find(p => p.id === msg.project_id);
              if (!proj || seen.has(proj.client_id)) continue;
              seen.add(proj.client_id);
              const client = allClients.find(c => c.id === proj.client_id);
              const clientName = client ? `${client.prenom ?? ''} ${client.nom}`.trim() : 'Client';
              notifs.push({
                id: msg.id,
                clientName,
                preview: msg.message.slice(0, 50),
                time: new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                clientId: proj.client_id,
              });
              if (notifs.length >= 9) break;
            }
            setAdminNotifs(notifs);
          }
        }
      }

      /* Real-time : nouveaux messages sur les projets des clients */
      supabase.channel('admin-project-msgs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_messages' },
          (payload) => {
            const msg = payload.new as Message;

            /* Si la conv est ouverte sur ce project_id → ajouter (sans doublon) */
            if (chatProjectIdRef.current === msg.project_id) {
              setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
            }

            /* Badge pastille pour les messages client uniquement */
            if (msg.auteur === 'client') {
              const proj   = projectsRef.current.find(p => p.id === msg.project_id);
              const client = proj ? clientsRef.current.find(c => c.id === proj.client_id) : undefined;
              if (proj) {
                const clientName = client
                  ? `${client.prenom ?? ''} ${client.nom}`.trim()
                  : 'Client';
                setAdminNotifs(prev => [
                  { id: msg.id, clientName, preview: msg.message.slice(0, 50),
                    time: new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    clientId: proj.client_id },
                  ...prev.filter(n => n.clientId !== proj.client_id).slice(0, 8),
                ]);
              }
            }
          })
        .subscribe();
    };
    init();
    fetchAll();

    return () => {
      cancelled = true;
      supabase.removeChannel(supabase.channel('admin-project-msgs'));
    };
  }, []);

  /* Sync refs */
  useEffect(() => { projectsRef.current      = projects;     }, [projects]);
  useEffect(() => { clientsRef.current       = clients;      }, [clients]);
  useEffect(() => { chatProjectIdRef.current = chatProjectId; }, [chatProjectId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchAll = async () => {
    const [{ data: c }, { data: p }, { data: i }] = await Promise.all([
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('*, clients(nom, prenom)').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*, clients(nom)').order('created_at', { ascending: false }),
    ]);
    if (c) setClients(c);
    if (p) setProjects(p);
    if (i) setInvoices(i);
    setLoading(false);
  };

  /* ── CRUD Projects ── */
  const saveProject = async () => {
    if (!pForm.titre.trim() || !pForm.client_id) return;
    if (projectModal.mode === 'add') {
      const { data } = await supabase.from('projects')
        .insert({ titre: pForm.titre, description: pForm.description, status: pForm.status, progress: pForm.progress, client_id: pForm.client_id })
        .select('*, clients(nom, prenom)').single();
      if (data) setProjects(prev => [data, ...prev]);
    } else if (selProjectId) {
      const { data } = await supabase.from('projects')
        .update({ titre: pForm.titre, description: pForm.description, status: pForm.status, progress: pForm.progress })
        .eq('id', selProjectId).select('*, clients(nom, prenom)').single();
      if (data) setProjects(prev => prev.map(p => p.id === selProjectId ? data : p));
    }
    setProjectModal({ open: false, mode: 'add' }); setSelProjectId(null);
  };

  const deleteProject = async () => {
    if (!selProjectId) return;
    await supabase.from('projects').delete().eq('id', selProjectId);
    setProjects(prev => prev.filter(p => p.id !== selProjectId));
    setSelProjectId(null);
  };

  /* ── CRUD Invoices ── */
  const saveInvoice = async () => {
    if (!iForm.client_id || iForm.montant <= 0) return;
    const num = iForm.numero_facture.trim() || `INV-${Date.now().toString(36).toUpperCase()}`;

    let pdf_url: string | undefined;
    if (pdfFile) {
      setPdfUploading(true);
      const filePath = `${num}_${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(filePath, pdfFile, { upsert: true, contentType: 'application/pdf' });
      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('invoices').getPublicUrl(uploadData.path);
        pdf_url = publicUrl;
      }
      setPdfUploading(false);
    }

    if (invoiceModal.mode === 'add') {
      const { data } = await supabase.from('invoices')
        .insert({ numero_facture: num, montant: iForm.montant, statut: iForm.statut, description: iForm.description, client_id: iForm.client_id, ...(pdf_url ? { pdf_url } : {}) })
        .select('*, clients(nom)').single();
      if (data) setInvoices(prev => [data, ...prev]);
    } else if (selInvoiceId) {
      const { data } = await supabase.from('invoices')
        .update({ numero_facture: num, montant: iForm.montant, statut: iForm.statut, description: iForm.description, ...(pdf_url ? { pdf_url } : {}) })
        .eq('id', selInvoiceId).select('*, clients(nom)').single();
      if (data) setInvoices(prev => prev.map(i => i.id === selInvoiceId ? data : i));
    }
    setPdfFile(null);
    setInvoiceModal({ open: false, mode: 'add' }); setSelInvoiceId(null);
  };

  const deleteInvoice = async () => {
    if (!selInvoiceId) return;
    await supabase.from('invoices').delete().eq('id', selInvoiceId);
    setInvoices(prev => prev.filter(i => i.id !== selInvoiceId));
    setSelInvoiceId(null);
  };

  /* ── CRUD Clients ── */
  const saveClient = async () => {
    if (!cForm.nom.trim() || !cForm.email.trim()) return;
    if (clientModal.mode === 'add') {
      const { data } = await supabase.from('clients')
        .insert({ nom: cForm.nom, prenom: cForm.prenom, email: cForm.email, entreprise: cForm.entreprise, type: cForm.type, role: cForm.role })
        .select().single();
      if (data) setClients(prev => [data, ...prev]);
    } else if (selClientId) {
      const { data } = await supabase.from('clients')
        .update({ nom: cForm.nom, prenom: cForm.prenom, email: cForm.email, entreprise: cForm.entreprise, type: cForm.type })
        .eq('id', selClientId).select().single();
      if (data) setClients(prev => prev.map(c => c.id === selClientId ? data : c));
    }
    setClientModal({ open: false, mode: 'add' }); setSelClientId(null);
  };

  const deleteClient = async () => {
    if (!selClientId) return;
    await supabase.from('clients').delete().eq('id', selClientId);
    setClients(prev => prev.filter(c => c.id !== selClientId));
    setSelClientId(null);
  };

  /* ── Messages ── */
  const openClientChat = async (clientId: string) => {
    setChatClientId(clientId);
    setActiveSection('messages');
    setMessages([]);
    setChatProjects([]);
    setChatProjectId('');

    /* Récupérer les projets de ce client */
    const { data: cProjects } = await supabase
      .from('projects')
      .select('id, titre')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    const projs = cProjects ?? [];
    setChatProjects(projs);

    if (projs.length > 0) {
      const firstId = projs[0].id;
      setChatProjectId(firstId);
      const { data: msgs } = await supabase
        .from('project_messages')
        .select('*')
        .eq('project_id', firstId)
        .order('created_at', { ascending: true })
        .limit(200);
      setMessages(msgs ?? []);
    }

    setAdminNotifs(prev => prev.filter(n => n.clientId !== clientId));
  };

  const loadProjectMessages = async (projectId: string) => {
    setChatProjectId(projectId);
    const { data } = await supabase
      .from('project_messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    setMessages(data ?? []);
  };

  const sendMessage = async () => {
    if (!msgInput.trim() || sending || !chatProjectId) return;
    setSending(true);
    const content = msgInput.trim();
    setMsgInput('');

    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      project_id: chatProjectId,
      auteur: 'admin',
      message: content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    const { data, error } = await supabase
      .from('project_messages')
      .insert({ project_id: chatProjectId, auteur: 'admin', message: content })
      .select()
      .single();

    if (data) {
      /* Supprimer le temp ET l'éventuel doublon ajouté par real-time, puis ajouter le définitif */
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempMsg.id && m.id !== (data as Message).id);
        return [...filtered, data as Message];
      });
    } else {
      /* Rollback silencieux */
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setMsgInput(content);
    }
    setSending(false);
  };

  const handleSignOut = useCallback(async () => {
    await fetch('/api/admin-verify', { method: 'DELETE' });
    await signOut();
    router.push('/');
  }, [router]);

  /* ── Computed (memoized) ── */
  const totalRevenue      = useMemo(() => invoices.filter(i => i.statut === 'payée' || i.statut === 'payee').reduce((s, i) => s + i.montant, 0), [invoices]);
  const nonAdminClients   = useMemo(() => clients.filter(c => c.role !== 'admin'), [clients]);
  const filteredProjects  = useMemo(() => statusFilter ? projects.filter(p => p.status === statusFilter) : projects, [projects, statusFilter]);
  const pagedProjects     = useMemo(() => filteredProjects.slice((projectPage - 1) * PAGE_SIZE, projectPage * PAGE_SIZE), [filteredProjects, projectPage]);
  const totalProjectPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const pagedInvoices     = useMemo(() => invoices.slice((invoicePage - 1) * PAGE_SIZE, invoicePage * PAGE_SIZE), [invoices, invoicePage]);
  const totalInvoicePages = Math.max(1, Math.ceil(invoices.length / PAGE_SIZE));
  const filteredClients   = useMemo(() => nonAdminClients.filter(c => `${c.nom} ${c.prenom ?? ''} ${c.entreprise ?? ''}`.toLowerCase().includes(clientSearch.toLowerCase())), [nonAdminClients, clientSearch]);
  const pagedClients      = useMemo(() => filteredClients.slice((clientPage - 1) * PAGE_SIZE, clientPage * PAGE_SIZE), [filteredClients, clientPage]);
  const totalClientPages  = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));

  const projectTableData = useMemo<ProjectRow[]>(() => projects.slice(0, 5).map(p => ({
    id: p.id, titre: p.titre, progress: p.progress, status: p.status,
    client: p.clients ? `${p.clients.prenom ?? ''} ${p.clients.nom}`.trim() : '—',
  })), [projects]);
  const coreRowModel = useMemo(() => getCoreRowModel<ProjectRow>(), []);
  const projectTable = useReactTable({ data: projectTableData, columns: projectColumns, getCoreRowModel: coreRowModel });

  const chatClient = clients.find(c => c.id === chatClientId);
  const selProject = projects.find(p => p.id === selProjectId);
  const selInvoice = invoices.find(i => i.id === selInvoiceId);
  const selClient  = clients.find(c => c.id === selClientId);

  /* Modal open helpers */
  const openAddProject  = () => { setPForm({ titre: '', description: '', status: 'en_attente', progress: 0, client_id: nonAdminClients[0]?.id ?? '' }); setSelProjectId(null); setProjectModal({ open: true, mode: 'add' }); };
  const openEditProject = () => { if (!selProject) return; setPForm({ titre: selProject.titre, description: selProject.description ?? '', status: selProject.status, progress: selProject.progress, client_id: selProject.client_id }); setProjectModal({ open: true, mode: 'edit' }); };
  const openAddInvoice  = () => { setIForm({ numero_facture: '', montant: 0, statut: 'en_attente', description: '', client_id: nonAdminClients[0]?.id ?? '' }); setPdfFile(null); setSelInvoiceId(null); setInvoiceModal({ open: true, mode: 'add' }); };
  const openEditInvoice = () => { if (!selInvoice) return; setIForm({ numero_facture: selInvoice.numero_facture ?? '', montant: selInvoice.montant, statut: selInvoice.statut, description: selInvoice.description ?? '', client_id: selInvoice.client_id }); setPdfFile(null); setInvoiceModal({ open: true, mode: 'edit' }); };
  const openAddClient   = () => { setCForm({ nom: '', prenom: '', email: '', entreprise: '', type: 'particulier', role: 'client' }); setSelClientId(null); setClientModal({ open: true, mode: 'add' }); };
  const openEditClient  = () => { if (!selClient) return; setCForm({ nom: selClient.nom, prenom: selClient.prenom ?? '', email: selClient.email, entreprise: selClient.entreprise ?? '', type: selClient.type, role: selClient.role }); setClientModal({ open: true, mode: 'edit' }); };

  return (
    <div className="min-h-screen flex bg-surface">

      {/* ═══ MODALS ═══ */}
      <Modal open={projectModal.open} onClose={() => setProjectModal(s => ({ ...s, open: false }))}
        title={projectModal.mode === 'add' ? 'Nouveau Projet' : 'Modifier le Projet'}>
        <div className="space-y-4">
          <Field label="Titre *"><input className={inputCls} value={pForm.titre} onChange={e => setPForm(s => ({ ...s, titre: e.target.value }))} placeholder="Nom du projet" /></Field>
          <Field label="Description"><textarea className={inputCls + ' resize-none'} rows={3} value={pForm.description} onChange={e => setPForm(s => ({ ...s, description: e.target.value }))} placeholder="Description..." /></Field>
          <Field label="Client *">
            <select className={inputCls} value={pForm.client_id} onChange={e => setPForm(s => ({ ...s, client_id: e.target.value }))}>
              <option value="">Sélectionner un client</option>
              {nonAdminClients.map(c => <option key={c.id} value={c.id}>{c.prenom ? `${c.prenom} ${c.nom}` : c.nom} — {c.email}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Statut">
              <select className={inputCls} value={pForm.status} onChange={e => setPForm(s => ({ ...s, status: e.target.value }))}>
                <option value="en_attente">En attente</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
            </Field>
            <Field label="Progression (%)">
              <input type="number" min={0} max={100} className={inputCls} value={pForm.progress} onChange={e => setPForm(s => ({ ...s, progress: Math.min(100, Math.max(0, +e.target.value)) }))} />
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setProjectModal(s => ({ ...s, open: false }))} className="flex-1 btn-ghost py-2.5 text-sm rounded-xl">Annuler</button>
            <button onClick={saveProject} className="flex-1 btn-primary py-2.5 text-sm rounded-xl">{projectModal.mode === 'add' ? 'Créer le projet' : 'Enregistrer'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={invoiceModal.open} onClose={() => setInvoiceModal(s => ({ ...s, open: false }))}
        title={invoiceModal.mode === 'add' ? 'Nouvelle Facture' : 'Modifier la Facture'}>
        <div className="space-y-4">
          <Field label="Client *">
            <select className={inputCls} value={iForm.client_id} onChange={e => setIForm(s => ({ ...s, client_id: e.target.value }))} disabled={invoiceModal.mode === 'edit'}>
              <option value="">Sélectionner un client</option>
              {nonAdminClients.map(c => <option key={c.id} value={c.id}>{c.prenom ? `${c.prenom} ${c.nom}` : c.nom} — {c.email}</option>)}
            </select>
          </Field>
          <Field label="Numéro de facture"><input className={inputCls} value={iForm.numero_facture} onChange={e => setIForm(s => ({ ...s, numero_facture: e.target.value }))} placeholder="Auto-généré si vide" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Montant (€) *"><input type="number" min={0} step={0.01} className={inputCls} value={iForm.montant || ''} onChange={e => setIForm(s => ({ ...s, montant: +e.target.value }))} placeholder="0.00" /></Field>
            <Field label="Statut">
              <select className={inputCls} value={iForm.statut} onChange={e => setIForm(s => ({ ...s, statut: e.target.value }))}>
                <option value="en_attente">En attente</option>
                <option value="envoyée">Envoyée</option>
                <option value="payée">Payée</option>
              </select>
            </Field>
          </div>
          <Field label="Description"><textarea className={inputCls + ' resize-none'} rows={2} value={iForm.description} onChange={e => setIForm(s => ({ ...s, description: e.target.value }))} placeholder="Description optionnelle" /></Field>
          <Field label="Fichier PDF (optionnel)">
            <label className={`${inputCls} flex items-center gap-2 cursor-pointer`}>
              <Upload size={14} className="text-outline shrink-0" />
              <span className="text-outline truncate text-xs">{pdfFile ? pdfFile.name : 'Choisir un PDF…'}</span>
              <input type="file" accept="application/pdf" className="hidden" onChange={e => setPdfFile(e.target.files?.[0] ?? null)} />
            </label>
            {pdfFile && (
              <button type="button" onClick={() => setPdfFile(null)} className="text-xs text-red-500 hover:underline mt-1">Retirer le fichier</button>
            )}
          </Field>
          <div className="flex gap-2 pt-2">
            <button onClick={() => { setInvoiceModal(s => ({ ...s, open: false })); setPdfFile(null); }} className="flex-1 btn-ghost py-2.5 text-sm rounded-xl">Annuler</button>
            <button onClick={saveInvoice} disabled={pdfUploading} className="flex-1 btn-primary py-2.5 text-sm rounded-xl disabled:opacity-60">
              {pdfUploading ? 'Upload PDF…' : invoiceModal.mode === 'add' ? 'Créer la facture' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={clientModal.open} onClose={() => setClientModal(s => ({ ...s, open: false }))}
        title={clientModal.mode === 'add' ? 'Ajouter un Client' : 'Modifier le Client'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom"><input className={inputCls} value={cForm.prenom} onChange={e => setCForm(s => ({ ...s, prenom: e.target.value }))} placeholder="Prénom" /></Field>
            <Field label="Nom *"><input className={inputCls} value={cForm.nom} onChange={e => setCForm(s => ({ ...s, nom: e.target.value }))} placeholder="Nom" /></Field>
          </div>
          <Field label="Email *"><input type="email" className={inputCls} value={cForm.email} onChange={e => setCForm(s => ({ ...s, email: e.target.value }))} placeholder="email@exemple.fr" /></Field>
          <Field label="Entreprise"><input className={inputCls} value={cForm.entreprise} onChange={e => setCForm(s => ({ ...s, entreprise: e.target.value }))} placeholder="Nom de l'entreprise" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select className={inputCls} value={cForm.type} onChange={e => setCForm(s => ({ ...s, type: e.target.value }))}>
                <option value="particulier">Particulier</option>
                <option value="entreprise">Entreprise</option>
              </select>
            </Field>
            <Field label="Rôle">
              <select className={inputCls} value={cForm.role} onChange={e => setCForm(s => ({ ...s, role: e.target.value }))}>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setClientModal(s => ({ ...s, open: false }))} className="flex-1 btn-ghost py-2.5 text-sm rounded-xl">Annuler</button>
            <button onClick={saveClient} className="flex-1 btn-primary py-2.5 text-sm rounded-xl">{clientModal.mode === 'add' ? 'Ajouter le client' : 'Enregistrer'}</button>
          </div>
        </div>
      </Modal>

      {/* ═══ PDF VIEWER ═══ */}
      {pdfViewUrl && (
        <PdfViewerModal
          url={pdfViewUrl}
          title={pdfViewTitle}
          onClose={() => setPdfViewUrl(null)}
        />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <aside className="hidden lg:flex w-56 flex-col bg-surface-container-lowest fixed inset-y-0 left-0 z-30 border-r border-surface-container-low">
        <div className="px-6 pt-6 pb-4">
          <p className="font-display font-extrabold text-base text-on-surface">NETCY Admin</p>
          <p className="text-[10px] text-outline uppercase tracking-widest mt-0.5">AGENCY PORTAL</p>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, section, icon: Icon }) => (
            <button key={label} onClick={() => setActiveSection(section)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative
                ${activeSection === section ? 'bg-blue-50 dark:bg-[#1a1f3d] text-primary dark:text-[#d0bcff]' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
              <Icon size={16} strokeWidth={1.5} />
              {label}
              {section === 'messages' && unreadNotifs > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-600 dark:bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadNotifs}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-6 border-t border-surface-container-low pt-4 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low">
            <HelpCircle size={16} strokeWidth={1.5} /> Aide
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-red-50 dark:hover:bg-[#450A0A] hover:text-red-600 dark:hover:text-red-400 transition-all">
            <LogOut size={16} strokeWidth={1.5} /> Déconnexion
          </button>
          {/* Avatar cliquable → profil */}
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-3 px-3 py-3 mt-1 w-full hover:bg-surface-container-low rounded-xl transition-colors group text-left"
          >
            <div className="relative w-8 h-8 flex-shrink-0">
              {adminAvatarUrl
                ? <img src={adminAvatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container dark:ring-surface-container-high" />
                : <div className="w-8 h-8 bg-surface-container-highest dark:bg-surface-container rounded-full flex items-center justify-center text-white text-xs font-bold">JM</div>
              }
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary dark:group-hover:text-[#d0bcff] transition-colors">Jean-Marie</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Admin · Mon profil</p>
            </div>
          </button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      {/* Mobile top nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-surface-container-lowest border-b border-surface-container-low">
        <div className="flex overflow-x-auto gap-1 px-3 py-2">
          {NAV.map(({ label, section, icon: Icon }) => (
            <button key={label} onClick={() => setActiveSection(section)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all relative
                ${activeSection === section ? 'bg-blue-50 dark:bg-[#1a1f3d] text-primary dark:text-[#d0bcff]' : 'text-outline hover:bg-surface-container-low'}`}>
              <Icon size={14} />
              {label}
              {section === 'messages' && unreadNotifs > 0 && (
                <span className="w-4 h-4 bg-red-600 dark:bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadNotifs}</span>
              )}
            </button>
          ))}
          <button
            onClick={handleSignOut}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap text-red-500 hover:bg-red-50 dark:hover:bg-[#450A0A] transition-all ml-auto"
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </div>

      <main className="flex-1 lg:ml-56 p-4 pt-14 sm:p-6 sm:pt-14 lg:p-10 lg:pt-10 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-outline uppercase tracking-widest">CONTRÔLE CENTRAL</p>
            <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-on-surface flex items-center gap-3">
              Command Center
              <BotIcon
                size={34}
                animate={true}
                animation="default"
                loop={true}
                loopDelay={2500}
                className="text-primary dark:text-[#d0bcff]"
              />
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Bell – composant isolé pour ne pas re-rendre tout le dashboard */}
            <NotifBell
              adminNotifs={adminNotifs}
              onOpenChat={openClientChat}
              onViewAll={() => setActiveSection('messages')}
              onDismiss={(clientId) => setAdminNotifs(prev => prev.filter(n => n.clientId !== clientId))}
            />
            {/* Avatar admin cliquable → profil */}
            <button
              onClick={() => setProfileOpen(true)}
              className="relative w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/40 dark:hover:ring-[#d0bcff]/40 transition-all"
              title="Mon profil"
            >
              {adminAvatarUrl
                ? <img src={adminAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface text-xs font-bold">JM</div>
              }
            </button>
          </div>
        </div>

        {/* Management Bars */}
        {activeSection === 'projects' && (
          <AdminManagementBar totalPages={totalProjectPages} currentPage={projectPage} onPageChange={p => { setProjectPage(p); setSelProjectId(null); }}
            onAdd={openAddProject} onEdit={openEditProject} onDelete={deleteProject}
            addLabel="Nouveau projet" editLabel="Modifier" deleteLabel="Supprimer" hasSelection={!!selProjectId} />
        )}
        {activeSection === 'invoices' && (
          <AdminManagementBar totalPages={totalInvoicePages} currentPage={invoicePage} onPageChange={p => { setInvoicePage(p); setSelInvoiceId(null); }}
            onAdd={openAddInvoice} onEdit={openEditInvoice} onDelete={deleteInvoice}
            addLabel="Nouvelle facture" editLabel="Modifier" deleteLabel="Supprimer" hasSelection={!!selInvoiceId} />
        )}
        {activeSection === 'clients' && (
          <AdminManagementBar totalPages={totalClientPages} currentPage={clientPage} onPageChange={p => { setClientPage(p); setSelClientId(null); }}
            onAdd={openAddClient} onEdit={openEditClient} onDelete={deleteClient}
            addLabel="Ajouter client" editLabel="Modifier" deleteLabel="Supprimer" hasSelection={!!selClientId} />
        )}

        {/* ─── Sections ─── */}
        {loading ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm rounded-2xl"><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
            ))}
          </div>

        /* ══════════ DASHBOARD ══════════ */
        ) : activeSection === 'dashboard' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="px-6 pt-6 pb-0 flex-row justify-between items-center">
                  <CardTitle className="font-display text-lg text-on-surface">Projets récents</CardTitle>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
                          <Filter size={12} /> FILTRER {statusFilter && <span className="w-1.5 h-1.5 bg-primary dark:bg-[#d0bcff] rounded-full ml-1" />}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-44 p-2" align="end">
                        {[null, 'en_cours', 'en_attente', 'termine'].map(s => (
                          <button key={s ?? 'all'} onClick={() => setStatusFilter(s)}
                            className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'bg-blue-50 dark:bg-[#1a1f3d] text-primary dark:text-[#d0bcff]' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                            {s === null ? 'Tous' : s === 'en_cours' ? 'En cours' : s === 'en_attente' ? 'En attente' : 'Terminé'}
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
                    <button onClick={() => setActiveSection('projects')} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">Voir tout <ChevronRight size={12} /></button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-surface-container-low hover:bg-transparent">
                        {projectTable.getHeaderGroups().map(hg => hg.headers.map(header => (
                          <TableHead key={header.id} className="px-6 py-3 text-[10px] font-semibold text-outline uppercase tracking-widest">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectTable.getRowModel().rows.length > 0 ? projectTable.getRowModel().rows.map(row => (
                        <TableRow key={row.id} className="border-b border-surface-container hover:bg-surface transition-colors">
                          <TableCell className="px-6 py-4"><p className="font-semibold text-sm text-on-surface">{row.original.titre}</p></TableCell>
                          <TableCell className="px-6 py-4 text-xs text-outline">{row.original.client}</TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="progress-track h-1.5 w-24"><div className="progress-fill h-full" style={{ width: `${row.original.progress}%` }} /></div>
                              <p className="text-xs text-outline">{row.original.progress}%</p>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">{statusBadge(row.original.status)}</TableCell>
                        </TableRow>
                      )) : <TableRow><TableCell colSpan={4} className="px-6 py-8 text-center text-sm text-outline">Aucun projet</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="px-6 pt-6 pb-0 flex-row justify-between items-center">
                  <CardTitle className="font-display text-lg text-on-surface">Factures récentes</CardTitle>
                  <button onClick={() => setActiveSection('invoices')} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">Voir tout <ChevronRight size={12} /></button>
                </CardHeader>
                <CardContent className="p-6 grid sm:grid-cols-2 gap-3">
                  {invoices.slice(0, 4).map(inv => (
                    <div key={inv.id} className="bg-surface rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] font-semibold text-outline uppercase">{inv.numero_facture ?? `INV-${inv.id.slice(0, 8).toUpperCase()}`}</p>
                          <p className="font-display font-bold text-base text-on-surface mt-0.5">{inv.clients?.nom ?? 'Client'}</p>
                        </div>
                        {invoiceBadge(inv.statut)}
                      </div>
                      <p className="font-semibold text-on-surface">{inv.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                  ))}
                  {invoices.length === 0 && <p className="text-sm text-outline col-span-2 text-center py-4">Aucune facture</p>}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="px-6 pt-6 pb-0 flex-row justify-between items-center">
                  <CardTitle className="font-display text-lg text-on-surface">Clients</CardTitle>
                  <button onClick={() => setActiveSection('clients')} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">Voir tout <ChevronRight size={12} /></button>
                </CardHeader>
                <CardContent className="p-6 grid sm:grid-cols-3 gap-3">
                  {nonAdminClients.slice(0, 6).map(c => {
                    const ini = `${(c.prenom ?? c.nom ?? '?')[0]}${(c.nom ?? '?')[0]}`.toUpperCase();
                    const bg = ['bg-primary dark:bg-[#d0bcff]', 'bg-surface-container-high', 'bg-red-600', 'bg-outline'][c.id.charCodeAt(0) % 4];
                    return (
                      <div key={c.id} className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center text-white text-xs font-bold`}>{ini}</div>
                          <button onClick={() => openClientChat(c.id)} className="text-outline-variant hover:text-primary dark:hover:text-[#d0bcff] transition-colors"><MessageSquare size={14} /></button>
                        </div>
                        <p className="font-semibold text-sm text-on-surface">{c.entreprise && c.entreprise !== 'Particulier' ? c.entreprise : `${c.prenom ?? ''} ${c.nom}`.trim()}</p>
                        <p className="text-xs text-outline mt-0.5 truncate">{c.email}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {adminNotifs.length > 0 && (
                <Card className="border-0 shadow-sm rounded-2xl border-l-4 border-l-red-600 dark:border-l-red-400">
                  <CardHeader className="px-5 pt-5 pb-0">
                    <CardTitle className="font-display text-base text-on-surface flex items-center gap-2"><Bell size={14} className="text-red-600 dark:text-red-400" /> Messages en attente</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-2">
                    {adminNotifs.map(n => (
                      <button key={n.id} onClick={() => openClientChat(n.clientId)} className="w-full text-left bg-red-50 dark:bg-[#3b0404] rounded-xl p-3 hover:bg-red-100 dark:hover:bg-[#450A0A] transition-colors">
                        <p className="text-sm font-semibold text-on-surface">{n.clientName}</p>
                        <p className="text-xs text-outline truncate">{n.preview}</p>
                        <p className="text-[10px] text-outline-variant mt-0.5">{n.time}</p>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="px-5 pt-5 pb-0">
                  <CardTitle className="font-display text-base text-on-surface">Revenus mensuels</CardTitle>
                  <p className="text-[10px] text-outline uppercase tracking-widest mt-0.5">{totalRevenue >= 1000 ? `${(totalRevenue / 1000).toFixed(1)}k€` : `${totalRevenue}€`} encaissés</p>
                </CardHeader>
                <CardContent className="p-4">
                  <ChartContainer config={chartConfig} className="h-[120px] w-full">
                    <BarChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#73777F' }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="px-5 pt-5 pb-0"><CardTitle className="font-display text-base text-on-surface">Agenda</CardTitle></CardHeader>
                <CardContent className="p-2 flex justify-center">
                  <Calendar mode="single" selected={calendarDate} onSelect={setCalendarDate} className="rounded-xl" />
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3"><BarChart2 size={16} className="text-primary dark:text-[#d0bcff]" strokeWidth={1.5} /></div>
                    <p className="text-[10px] text-outline uppercase tracking-wider mb-1">PROJETS</p>
                    <p className="font-display font-extrabold text-xl text-on-surface">{projects.length}</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3"><Users size={16} className="text-primary dark:text-[#d0bcff]" strokeWidth={1.5} /></div>
                    <p className="text-[10px] text-outline uppercase tracking-wider mb-1">CLIENTS</p>
                    <p className="font-display font-extrabold text-xl text-on-surface">{nonAdminClients.length}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

        /* ══════════ PROJETS ══════════ */
        ) : activeSection === 'projects' ? (
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="px-6 pt-6 pb-0 flex-row justify-between items-center flex-wrap gap-3">
              <div>
                <CardTitle className="font-display text-lg text-on-surface">Tous les Projets</CardTitle>
                <p className="text-xs text-outline mt-0.5">{filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
                    <Filter size={12} /> {statusFilter === 'en_cours' ? 'En cours' : statusFilter === 'en_attente' ? 'En attente' : statusFilter === 'termine' ? 'Terminé' : 'Tous'}
                    {statusFilter && <span className="w-1.5 h-1.5 bg-primary dark:bg-[#d0bcff] rounded-full" />}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-44 p-2" align="end">
                  {[null, 'en_cours', 'en_attente', 'termine'].map(s => (
                    <button key={s ?? 'all'} onClick={() => { setStatusFilter(s); setProjectPage(1); }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'bg-blue-50 dark:bg-[#1a1f3d] text-primary dark:text-[#d0bcff]' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                      {s === null ? 'Tous' : s === 'en_cours' ? 'En cours' : s === 'en_attente' ? 'En attente' : 'Terminé'}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent className="p-0 mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-surface-container-low hover:bg-transparent">
                    {['PROJET', 'CLIENT', 'PROGRESSION', 'STATUT', 'DATE'].map(h => <TableHead key={h} className="px-6 py-3 text-[10px] font-semibold text-outline uppercase tracking-widest">{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedProjects.length > 0 ? pagedProjects.map(p => (
                    <TableRow key={p.id} onClick={() => setSelProjectId(prev => prev === p.id ? null : p.id)}
                      className={`border-b border-surface-container cursor-pointer transition-colors ${selProjectId === p.id ? 'bg-blue-50 dark:bg-[#1a1f3d]' : 'hover:bg-surface'}`}>
                      <TableCell className="px-6 py-4">
                        <p className="font-semibold text-sm text-on-surface">{p.titre}</p>
                        {p.description && <p className="text-xs text-outline mt-0.5 truncate max-w-full sm:max-w-[200px]">{p.description}</p>}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-xs text-outline">{p.clients ? `${p.clients.prenom ?? ''} ${p.clients.nom}`.trim() : '—'}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="progress-track h-1.5 w-28"><div className="progress-fill h-full" style={{ width: `${p.progress}%` }} /></div>
                          <p className="text-xs text-outline">{p.progress}%</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">{statusBadge(p.status)}</TableCell>
                      <TableCell className="px-6 py-4 text-xs text-outline">{new Date(p.created_at).toLocaleDateString('fr-FR')}</TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={5} className="px-6 py-12 text-center text-sm text-outline">Aucun projet · cliquez sur &quot;Nouveau projet&quot; pour commencer</TableCell></TableRow>}
                </TableBody>
              </Table>
              {selProjectId && (
                <div className="px-6 py-3 bg-blue-50 dark:bg-[#1a1f3d] border-t border-blue-200 dark:border-[#2a2563] text-xs text-primary dark:text-[#d0bcff] flex items-center gap-2">
                  <span className="font-semibold">{selProject?.titre}</span> sélectionné · recliquez pour désélectionner
                </div>
              )}
            </CardContent>
          </Card>

        /* ══════════ FACTURES ══════════ */
        ) : activeSection === 'invoices' ? (
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="px-6 pt-6 pb-0 flex-row justify-between items-center">
              <div>
                <CardTitle className="font-display text-lg text-on-surface">Toutes les Factures</CardTitle>
                <p className="text-xs text-outline mt-0.5">{invoices.length} facture{invoices.length !== 1 ? 's' : ''} · {totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} encaissés</p>
              </div>
            </CardHeader>
            <CardContent className="p-0 mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-surface-container-low hover:bg-transparent">
                    {['N° FACTURE', 'CLIENT', 'MONTANT', 'STATUT', 'DATE', ''].map(h => <TableHead key={h} className="px-6 py-3 text-[10px] font-semibold text-outline uppercase tracking-widest">{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedInvoices.length > 0 ? pagedInvoices.map(inv => (
                    <TableRow key={inv.id} onClick={() => setSelInvoiceId(prev => prev === inv.id ? null : inv.id)}
                      className={`border-b border-surface-container cursor-pointer transition-colors ${selInvoiceId === inv.id ? 'bg-blue-50 dark:bg-[#1a1f3d]' : 'hover:bg-surface'}`}>
                      <TableCell className="px-6 py-4">
                        <p className="font-mono text-xs font-semibold text-on-surface-variant">{inv.numero_facture ?? `INV-${inv.id.slice(0, 8).toUpperCase()}`}</p>
                        {inv.description && <p className="text-xs text-outline mt-0.5 truncate max-w-[180px]">{inv.description}</p>}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-on-surface font-medium">{inv.clients?.nom ?? '—'}</TableCell>
                      <TableCell className="px-6 py-4"><p className="font-display font-bold text-sm text-on-surface">{inv.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p></TableCell>
                      <TableCell className="px-6 py-4">{invoiceBadge(inv.statut)}</TableCell>
                      <TableCell className="px-6 py-4 text-xs text-outline">{new Date(inv.created_at).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="px-6 py-4">
                        {inv.pdf_url && (
                          <button
                            onClick={e => { e.stopPropagation(); setPdfViewUrl(inv.pdf_url!); setPdfViewTitle(inv.numero_facture ?? `INV-${inv.id.slice(0, 8).toUpperCase()}`); }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-[#1a1f3d] text-primary dark:text-[#d0bcff] hover:bg-blue-100 dark:hover:bg-[#1e2450] transition-colors"
                          >
                            <Eye size={12} /> PDF
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={6} className="px-6 py-12 text-center text-sm text-outline">Aucune facture · cliquez sur &quot;Nouvelle facture&quot; pour commencer</TableCell></TableRow>}
                </TableBody>
              </Table>
              {selInvoiceId && (
                <div className="px-6 py-3 bg-blue-50 dark:bg-[#1a1f3d] border-t border-blue-200 dark:border-[#2a2563] text-xs text-primary dark:text-[#d0bcff] flex items-center gap-2">
                  <span className="font-semibold">{selInvoice?.numero_facture ?? `INV-${selInvoice?.id.slice(0, 8).toUpperCase()}`}</span> sélectionnée · recliquez pour désélectionner
                </div>
              )}
            </CardContent>
          </Card>

        /* ══════════ CLIENTS ══════════ */
        ) : activeSection === 'clients' ? (
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="px-6 pt-6 pb-0 flex-row justify-between items-center gap-3 flex-wrap">
              <div>
                <CardTitle className="font-display text-lg text-on-surface">Répertoire Clients</CardTitle>
                <p className="text-xs text-outline mt-0.5">{filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-2 text-xs text-outline w-52">
                <Search size={12} />
                <input type="text" value={clientSearch} onChange={e => { setClientSearch(e.target.value); setClientPage(1); }}
                  placeholder="Rechercher..." className="bg-transparent focus:outline-none flex-1 placeholder-[#C3C6CF]" />
              </div>
            </CardHeader>
            <CardContent className="p-0 mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-surface-container-low hover:bg-transparent">
                    {['CLIENT', 'EMAIL', 'ENTREPRISE', 'TYPE', 'INSCRIT LE', 'MSG'].map(h => <TableHead key={h} className="px-6 py-3 text-[10px] font-semibold text-outline uppercase tracking-widest">{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedClients.length > 0 ? pagedClients.map(c => {
                    const ini = `${(c.prenom ?? c.nom ?? '?')[0]}${(c.nom ?? '?')[0]}`.toUpperCase();
                    return (
                      <TableRow key={c.id} onClick={() => setSelClientId(prev => prev === c.id ? null : c.id)}
                        className={`border-b border-surface-container cursor-pointer transition-colors ${selClientId === c.id ? 'bg-blue-50 dark:bg-[#1a1f3d]' : 'hover:bg-surface'}`}>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary dark:bg-[#d0bcff] rounded-full flex items-center justify-center text-white dark:text-[#1D1B20] text-xs font-bold flex-shrink-0">{ini}</div>
                            <div>
                              <p className="font-semibold text-sm text-on-surface">{`${c.prenom ?? ''} ${c.nom}`.trim()}</p>
                              <p className="text-[10px] text-outline uppercase tracking-wider">{c.role}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs text-outline">{c.email}</TableCell>
                        <TableCell className="px-6 py-4 text-xs text-outline">{c.entreprise || '—'}</TableCell>
                        <TableCell className="px-6 py-4"><span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant">{c.type.toUpperCase()}</span></TableCell>
                        <TableCell className="px-6 py-4 text-xs text-outline">{new Date(c.created_at).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="px-6 py-4">
                          <button onClick={e => { e.stopPropagation(); openClientChat(c.id); }} className="text-outline-variant hover:text-primary dark:hover:text-[#d0bcff] transition-colors">
                            <MessageSquare size={14} />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  }) : <TableRow><TableCell colSpan={6} className="px-6 py-12 text-center text-sm text-outline">Aucun client</TableCell></TableRow>}
                </TableBody>
              </Table>
              {selClientId && (
                <div className="px-6 py-3 bg-blue-50 dark:bg-[#1a1f3d] border-t border-blue-200 dark:border-[#2a2563] text-xs text-primary dark:text-[#d0bcff] flex items-center gap-2">
                  <span className="font-semibold">{selClient ? `${selClient.prenom ?? ''} ${selClient.nom}`.trim() : ''}</span> sélectionné · recliquez pour désélectionner
                </div>
              )}
            </CardContent>
          </Card>

        /* ══════════ MESSAGES ══════════ */
        ) : activeSection === 'messages' ? (
          <div className="grid lg:grid-cols-[280px_1fr] gap-6" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-surface-container-low flex items-center justify-between">
                <p className="font-semibold text-sm text-on-surface">Conversations</p>
                <span className="text-xs text-outline">{nonAdminClients.length} client(s)</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {nonAdminClients.length === 0 ? (
                  <div className="p-6 text-center text-sm text-outline">Aucun client</div>
                ) : nonAdminClients.map(c => {
                  const ini = `${(c.prenom ?? c.nom ?? '?')[0]}${(c.nom ?? '?')[0]}`.toUpperCase();
                  const hasUnread = adminNotifs.some(n => n.clientId === c.id);
                  const clientProjectCount = projects.filter(p => p.client_id === c.id).length;
                  return (
                    <button key={c.id} onClick={() => openClientChat(c.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface transition-colors border-b border-surface-container-low ${chatClientId === c.id ? 'bg-blue-50 dark:bg-[#1a1f3d]' : ''}`}>
                      <div className="relative">
                        <div className="w-9 h-9 bg-primary dark:bg-[#d0bcff] rounded-full flex items-center justify-center text-white dark:text-[#1D1B20] text-xs font-bold flex-shrink-0">{ini}</div>
                        {hasUnread && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-600 dark:bg-red-500 rounded-full border-2 border-surface-container-lowest animate-ping" />}
                        {hasUnread && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-600 dark:bg-red-500 rounded-full border-2 border-surface-container-lowest" />}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${chatClientId === c.id ? 'text-primary dark:text-[#d0bcff]' : 'text-on-surface'}`}>{`${c.prenom ?? ''} ${c.nom}`.trim()}</p>
                        <p className="text-xs text-outline truncate">{clientProjectCount} projet(s) · {c.email}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden flex flex-col">
              {!chatClientId ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare size={32} className="text-outline-variant mx-auto mb-3" />
                    <p className="text-outline font-medium text-sm">Sélectionnez un client</p>
                    <p className="text-xs text-outline-variant mt-1">pour afficher la conversation</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header client */}
                  <div className="px-5 py-4 border-b border-surface-container-low flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary dark:bg-[#d0bcff] rounded-full flex items-center justify-center text-white dark:text-[#1D1B20] text-xs font-bold">
                      {`${(chatClient?.prenom ?? chatClient?.nom ?? '?')[0]}${(chatClient?.nom ?? '?')[0]}`.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{`${chatClient?.prenom ?? ''} ${chatClient?.nom ?? ''}`.trim()}</p>
                      <p className="text-xs text-outline">{chatClient?.email}</p>
                    </div>
                  </div>

                  {/* Sélecteur de projet */}
                  {chatProjects.length > 1 && (
                    <div className="flex gap-2 px-4 py-2 bg-surface-container-lowest border-b border-surface-container-low overflow-x-auto">
                      {chatProjects.map(p => (
                        <button key={p.id} onClick={() => loadProjectMessages(p.id)}
                          className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all
                            ${chatProjectId === p.id ? 'bg-primary dark:bg-[#d0bcff] text-white dark:text-[#1D1B20]' : 'bg-surface-container-low text-outline hover:bg-surface-container'}`}>
                          {p.titre}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-surface">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center"><p className="text-sm text-outline">Aucun message sur ce projet</p></div>
                    ) : messages.map(m => {
                      const isMe = m.auteur === 'admin';
                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                          {!isMe && <div className="w-7 h-7 bg-primary dark:bg-[#d0bcff] rounded-full flex items-center justify-center text-white dark:text-[#1D1B20] text-[10px] font-bold flex-shrink-0">{(chatClient?.prenom ?? 'C')[0].toUpperCase()}</div>}
                          <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${isMe ? 'bg-primary dark:bg-[#d0bcff] text-white dark:text-[#1D1B20] rounded-br-sm' : 'bg-surface-container-lowest shadow-sm text-on-surface rounded-bl-sm'}`}>
                            <p className="text-sm leading-relaxed">{m.message}</p>
                            <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-100 dark:text-[#b69df8] text-right' : 'text-outline-variant'}`}>
                              {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="bg-surface-container-lowest border-t border-surface-container-low px-4 py-3 flex items-center gap-3">
                    <input type="text" value={msgInput} onChange={e => setMsgInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder={`Répondre à ${chatClient?.prenom ?? 'ce client'}...`}
                      className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#d0bcff]/20" />
                    <button onClick={sendMessage} disabled={!msgInput.trim() || sending}
                      className="w-10 h-10 bg-primary dark:bg-[#d0bcff] rounded-xl flex items-center justify-center hover:bg-primary-dark dark:hover:bg-[#b69df8] transition-colors disabled:opacity-50 flex-shrink-0">
                      <Send size={15} className="text-white" />
                    </button>
                  </div>
                </>
              )}
            </Card>
          </div>
        ) : null}

        <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-outline-variant pt-4 border-t border-surface-container-low">
          <span>© {new Date().getFullYear()} NETCY DIGITAL ARCHITECTURE. TOUS DROITS RÉSERVÉS.</span>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="/politique-confidentialite" className="hover:text-outline">CONFIDENTIALITÉ</a>
            <span>·</span>
            <a href="#" className="hover:text-outline">STATUT SYSTÈME</a>
          </div>
        </footer>
      </main>

      {/* Profile panel admin */}
      <ProfilePanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        userId={adminId}
        onAvatarChange={(url) => setAdminAvatarUrl(url)}
      />
    </div>
  );
}
