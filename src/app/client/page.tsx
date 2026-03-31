'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase, getCurrentUser } from '@/lib/supabase';
import {
  FolderOpen, FileText, MessageSquare, TrendingUp,
  Send, CheckCircle2, Clock, AlertCircle, ChevronRight,
  Euro, LayoutDashboard, Bell, X as XIcon,
} from 'lucide-react';
import { BotIcon } from '@/components/animate-ui/icons/bot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfilePanel } from '@/components/profile-panel';

/* ── Types ── */
interface Project { id: string; titre: string; status: string; progress: number; description?: string; created_at: string; }
interface Invoice  { id: string; numero_facture?: string; montant: number; statut: string; description?: string; created_at: string; }
interface Message  { id: string; project_id: string; auteur: 'admin' | 'client'; message: string; created_at: string; }
interface Notif    { id: string; type: string; title: string; body: string; read: boolean; created_at: string; }

/* ── Helpers ── */
function statusBadge(s: string) {
  if (s === 'en_cours')   return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"><Clock size={9} />EN COURS</span>;
  if (s === 'termine')    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"><CheckCircle2 size={9} />TERMINÉ</span>;
  if (s === 'en_attente') return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"><AlertCircle size={9} />EN ATTENTE</span>;
  return <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-surface-container-low text-outline">{s.toUpperCase()}</span>;
}

function invoiceBadge(s: string) {
  if (s === 'payée' || s === 'payee')      return <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">PAYÉE</span>;
  if (s === 'envoyée' || s === 'envoye')   return <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">ENVOYÉE</span>;
  if (s === 'en_attente')                  return <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">À PAYER</span>;
  return <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-surface-container-low text-outline">{s.toUpperCase()}</span>;
}

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID ?? '';
type Section = 'dashboard' | 'projets' | 'factures' | 'messages';

/** Guard — affiché si la variable d'env est absente */
function AdminIdMissing() {
  return (
    <div className="p-6 bg-red-50 dark:bg-[#450A0A] rounded-2xl text-red-700 dark:text-red-400 text-sm">
      <strong>Configuration manquante :</strong> la variable <code>NEXT_PUBLIC_ADMIN_USER_ID</code> n'est pas définie.
      Ajoutez-la dans <code>.env.local</code> puis redémarrez le serveur.
    </div>
  );
}

function ClientDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = (searchParams.get('section') ?? 'dashboard') as Section;
  const [section, setSection] = useState<Section>(sectionParam);

  const [loading, setLoading]     = useState(true);
  const [userId, setUserId]       = useState('');
  const [userName, setUserName]   = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [projects, setProjects]   = useState<Project[]>([]);
  const [invoices, setInvoices]   = useState<Invoice[]>([]);
  const [messages,      setMessages]      = useState<Message[]>([]);
  const [msgInput,      setMsgInput]      = useState('');
  const [sending,       setSending]       = useState(false);
  const [notifs,        setNotifs]        = useState<Notif[]>([]);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [activeMsgProj, setActiveMsgProj] = useState(''); // project_id sélectionné dans la tab messages
  const [lastMsgsViewAt, setLastMsgsViewAt] = useState<number>(() =>
    typeof window !== 'undefined' ? parseInt(localStorage.getItem('netcy_lastMsgsViewAt') ?? '0') : 0
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const notifBellRef   = useRef<HTMLDivElement>(null);
  const sectionKey     = useRef(0);

  /* Sync section param */
  useEffect(() => { setSection(sectionParam); }, [sectionParam]);
  const goSection = (s: Section) => {
    setSection(s);
    router.push(`/client?section=${s}`, { scroll: false });
  };

  /* ── Init ── */
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const user = await getCurrentUser();
      if (cancelled) return;
      if (!user) { router.push('/connexion'); return; }
      setUserId(user.id);

      const { data: cd } = await supabase.from('clients').select('nom, prenom, avatar_url').eq('id', user.id).single();
      if (cancelled) return;
      if (cd) {
        const full = `${cd.prenom ?? ''} ${cd.nom}`.trim();
        setUserName(full || user.email?.split('@')[0] || 'Client');
        setUserInitials(`${(cd.prenom ?? cd.nom ?? '?')[0]}${(cd.nom ?? '?')[0]}`.toUpperCase());
        setAvatarUrl(cd.avatar_url ?? '');
      }

      const [{ data: proj }, { data: inv }, { data: nd }] = await Promise.all([
        supabase.from('projects').select('*').eq('client_id', user.id).order('created_at', { ascending: false }),
        supabase.from('invoices').select('*').eq('client_id', user.id).order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      ]);
      if (nd) setNotifs(nd);
      if (cancelled) return;

      if (proj) setProjects(proj);
      if (inv)  setInvoices(inv);

      /* Charger les messages de tous les projets du client */
      const projectIds = (proj ?? []).map(p => p.id);
      if (projectIds.length > 0) {
        const { data: msgs } = await supabase
          .from('project_messages')
          .select('*')
          .in('project_id', projectIds)
          .order('created_at', { ascending: true });
        if (cancelled) return;
        if (msgs) setMessages(msgs);

        /* Sélectionner par défaut le projet actif (ou le premier) */
        const active = (proj ?? []).find(p => p.status === 'en_cours') ?? (proj ?? [])[0];
        if (active) setActiveMsgProj(active.id);

        /* Real-time : nouveaux messages sur les projets du client */
        supabase.channel('client-proj-msgs')
          .on('postgres_changes', {
            event: 'INSERT', schema: 'public', table: 'project_messages',
          }, (payload) => {
            const msg = payload.new as Message;
            if (projectIds.includes(msg.project_id)) {
              setMessages(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
              });
            }
          })
          .subscribe();
      }

      /* Real-time : nouvelles notifications */
      supabase.channel('page-notifs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => setNotifs(prev => [payload.new as Notif, ...prev]))
        .subscribe();

      setLoading(false);
    };
    init();

    /* Fermer bell au clic extérieur */
    const handleOutside = (e: MouseEvent) => {
      if (notifBellRef.current && !notifBellRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);

    return () => {
      cancelled = true;
      document.removeEventListener('mousedown', handleOutside);
      supabase.removeChannel(supabase.channel('client-proj-msgs'));
      supabase.removeChannel(supabase.channel('page-notifs'));
    };
  }, [router]);

  useEffect(() => {
    if (section === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, section]);

  useEffect(() => {
    if (section === 'messages') {
      const now = Date.now();
      setLastMsgsViewAt(now);
      localStorage.setItem('netcy_lastMsgsViewAt', now.toString());
      /* Signaler au layout que les messages sont lus */
      window.dispatchEvent(new Event('netcy_msgs_read'));
      /* Marquer les notifications de type message comme lues */
      markNotifsRead();
    }
  }, [section]);

  const sendMessage = async () => {
    if (!msgInput.trim() || sending || !activeMsgProj) return;
    setSending(true);
    const content = msgInput.trim();
    setMsgInput('');

    /* Ajout optimiste */
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      project_id: activeMsgProj,
      auteur: 'client',
      message: content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    const { data, error } = await supabase
      .from('project_messages')
      .insert({ project_id: activeMsgProj, auteur: 'client', message: content })
      .select()
      .single();

    if (data) {
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? (data as Message) : m));
    } else if (error) {
      /* Rollback silencieux */
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setMsgInput(content);
    }
    setSending(false);
  };

  /* ── Marquer toutes les notifs comme lues ── */
  const unreadNotifs = notifs.filter(n => !n.read).length;
  const markNotifsRead = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    if (userId) await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
  };

  /* ── Computed ── */
  const activeProject    = projects.find(p => p.status === 'en_cours');
  const totalPaid        = invoices.filter(i => i.statut === 'payée' || i.statut === 'payee').reduce((s, i) => s + i.montant, 0);
  const unpaidCount      = invoices.filter(i => i.statut === 'en_attente').length;
  const unreadMsgCount   = messages.filter(m => m.auteur === 'admin' &&
    new Date(m.created_at).getTime() > lastMsgsViewAt).length;
  const totalUnread      = unreadNotifs + unreadMsgCount;
  const avgProgress      = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;
  const phases = [
    { label: 'Découverte',    done: (activeProject?.progress ?? 0) >= 25 },
    { label: 'Architecture',  done: (activeProject?.progress ?? 0) >= 50 },
    { label: 'UI Design',     done: (activeProject?.progress ?? 0) >= 75 },
    { label: 'Développement', done: (activeProject?.progress ?? 0) >= 100 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6">

      {/* ── Desktop header : Logo + Bell + Avatar → puis Greeting + Nav ── */}
      <div className="hidden lg:block">

        {/* Rangée 1 : Logo — Bell — Avatar */}
        <div className="flex items-center justify-between mb-5">
          <Link href="/">
            <img src="/images/logo_netcy_t.svg" alt="NETCY" className="h-10 w-auto logo-adaptive" />
          </Link>

          <div className="flex items-center gap-2">
            {/* Cloche */}
            <div className="relative" ref={notifBellRef}>
              <button
                onClick={() => { setNotifOpen(o => !o); if (!notifOpen) markNotifsRead(); }}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container-lowest border border-surface-container-low hover:bg-surface-container-low transition-colors"
              >
                <Bell size={16} className="text-on-surface-variant" />
                {totalUnread > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 dark:bg-red-500 rounded-full border-2 border-surface-container-lowest animate-ping" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 dark:bg-red-500 rounded-full border-2 border-surface-container-lowest" />
                  </>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 max-w-[calc(100vw-2rem)] bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container z-50 overflow-hidden animate-fade-up">
                  <div className="px-4 py-3 border-b border-surface-container-low flex items-center justify-between">
                    <p className="font-semibold text-sm text-on-surface">
                      Notifications {totalUnread > 0 && <span className="text-red-600 dark:text-red-400">({totalUnread})</span>}
                    </p>
                    <button onClick={() => setNotifOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-surface-container-low">
                      <XIcon size={13} className="text-outline" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-surface">
                    {/* Messages non lus */}
                    {unreadMsgCount > 0 && (
                      <button
                        onClick={() => { goSection('messages'); setNotifOpen(false); }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-[#1f2550] transition-colors flex items-center gap-3 bg-blue-50 dark:bg-[#1a1f3d]"
                      >
                        <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MessageSquare size={12} className="text-blue-700 dark:text-blue-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-on-surface">{unreadMsgCount} nouveau{unreadMsgCount > 1 ? 'x' : ''} message{unreadMsgCount > 1 ? 's' : ''}</p>
                          <p className="text-xs text-outline mt-0.5">Cliquez pour consulter</p>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-primary dark:bg-[#d0bcff] flex-shrink-0" />
                      </button>
                    )}
                    {/* Notifications */}
                    {notifs.length === 0 && unreadMsgCount === 0 ? (
                      <div className="py-8 text-center">
                        <Bell size={24} className="text-surface-container-highest mx-auto mb-2" />
                        <p className="text-sm text-outline">Aucune notification</p>
                      </div>
                    ) : notifs.map(n => (
                      <div key={n.id} className={`px-4 py-3 transition-colors ${n.read ? 'hover:bg-surface' : 'bg-blue-50 dark:bg-[#1a1f3d] hover:bg-blue-100 dark:hover:bg-[#1f2550]'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                            ${n.type === 'message' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                              n.type === 'invoice' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                              'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}>
                            {n.type === 'message' ? <MessageSquare size={12} /> :
                             n.type === 'invoice' ? <Euro size={12} /> :
                             <CheckCircle2 size={12} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-on-surface">{n.title}</p>
                            <p className="text-xs text-outline mt-0.5 leading-relaxed">{n.body}</p>
                            <p className="text-[10px] text-outline-variant mt-1">
                              {new Date(n.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-primary dark:bg-[#d0bcff] flex-shrink-0 mt-1.5" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  {(notifs.length > 0 || unreadMsgCount > 0) && (
                    <div className="px-4 py-2.5 border-t border-surface-container-low">
                      <button onClick={() => { markNotifsRead(); setNotifOpen(false); }}
                        className="text-xs text-primary dark:text-[#d0bcff] hover:text-primary-dark dark:hover:text-[#b69df8] font-medium transition-colors">
                        Tout marquer comme lu
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Avatar → profil */}
            <button
              onClick={() => setProfileOpen(true)}
              className="relative w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/40 dark:hover:ring-[#d0bcff]/40 transition-all"
              title="Mon profil"
            >
              {avatarUrl
                ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-primary dark:bg-[#d0bcff] flex items-center justify-center text-white dark:text-[#1D1B20] text-xs font-bold">{userInitials}</div>
              }
            </button>
          </div>
        </div>

        {/* Rangée 2 : Greeting — Nav tabs */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-outline uppercase tracking-widest">ESPACE CLIENT</p>
            {loading
              ? (
                <div className="flex items-center gap-3 mt-1">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-9 w-48" />
                </div>
              )
              : (
                <h1 className="font-display font-extrabold text-3xl text-on-surface flex items-center gap-3 mt-1">
                  Bonjour, {userName.split(' ')[0]}
                  <BotIcon size={30} animate loop loopDelay={2000} className="text-primary dark:text-[#d0bcff]" />
                </h1>
              )
            }
          </div>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1 bg-surface-container-low rounded-xl p-1">
            {([
              { id: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard },
              { id: 'projets',   label: 'Mes Projets',  icon: FolderOpen       },
              { id: 'factures',  label: 'Mes Factures', icon: FileText         },
              { id: 'messages',  label: 'Messages',     icon: MessageSquare    },
            ] as { id: Section; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[]).map(t => {
              const active = section === t.id;
              return (
                <button key={t.id} onClick={() => goSection(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative
                    ${active ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-outline hover:text-on-surface'}`}
                >
                  <t.icon
                    size={14}
                    className={active ? 'text-primary dark:text-[#d0bcff] icon-bounce' : ''}
                  />
                  {t.label}
                  {t.id === 'messages' && unreadMsgCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 dark:bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                      {unreadMsgCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ══════════ DASHBOARD ══════════ */}
      {section === 'dashboard' && (
        <div key={`dash-${sectionKey.current}`} className="space-y-6 section-animate">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Projets actifs', value: loading ? '—' : projects.filter(p => p.status === 'en_cours').length.toString(), icon: <FolderOpen size={16} className="text-primary dark:text-[#d0bcff]" />, bg: 'bg-[#EEF2FF] dark:bg-[#1a1f3d]', tab: 'projets' as Section },
              { label: 'Factures à payer', value: loading ? '—' : unpaidCount.toString(), icon: <Euro size={16} className="text-yellow-700 dark:text-yellow-300" />, bg: 'bg-yellow-100 dark:bg-yellow-900/20', tab: 'factures' as Section },
              { label: 'Progression moy.', value: loading ? '—' : `${avgProgress}%`, icon: <TrendingUp size={16} className="text-green-700 dark:text-green-300" />, bg: 'bg-green-100 dark:bg-green-900/20', tab: 'projets' as Section },
              { label: 'Messages non lus', value: loading ? '—' : totalUnread.toString(), icon: <MessageSquare size={16} className="text-red-600 dark:text-red-400" />, bg: 'bg-red-100 dark:bg-red-900/20', tab: 'messages' as Section },
            ].map(kpi => (
              <button key={kpi.label} onClick={() => goSection(kpi.tab)} className="text-left">
                <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className={`w-9 h-9 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>{kpi.icon}</div>
                    <p className="font-display font-extrabold text-2xl text-on-surface">{kpi.value}</p>
                    <p className="text-xs text-outline mt-0.5">{kpi.label}</p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>

          {/* Projet actif */}
          {!loading && activeProject && (
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary dark:text-[#d0bcff] bg-blue-50 dark:bg-[#1a1f3d] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <Clock size={10} /> Sprint en cours
                      </span>
                      <h2 className="font-display font-extrabold text-2xl text-on-surface mt-2">{activeProject.titre}</h2>
                      {activeProject.description && <p className="text-sm text-outline mt-1">{activeProject.description}</p>}
                    </div>
                    <div className="bg-surface-container-low rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#003EC7] to-[#0052FF] dark:from-[#b69df8] dark:to-[#d0bcff] transition-all duration-700" style={{ width: `${activeProject.progress}%` }} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {phases.map(ph => (
                        <div key={ph.label} className={`rounded-xl p-3 ${ph.done ? 'bg-[#EEF2FF] dark:bg-[#1a1f3d]' : 'bg-surface-container-low'}`}>
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-outline">{ph.label}</p>
                          <p className={`font-display font-bold text-sm mt-1 ${ph.done ? 'text-primary dark:text-[#d0bcff]' : 'text-outline-variant'}`}>
                            {ph.done ? '✓ Terminé' : 'À venir'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-extrabold text-6xl text-on-surface leading-none">
                      {activeProject.progress}<span className="text-2xl text-outline">%</span>
                    </p>
                    <p className="text-[10px] text-outline uppercase tracking-widest mt-1">Progression</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accès rapide */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Voir mes projets',   desc: `${projects.length} projet(s)`,  tab: 'projets'  as Section, icon: FolderOpen    },
              { label: 'Mes factures',       desc: `${invoices.length} facture(s)`, tab: 'factures' as Section, icon: FileText      },
              { label: 'Envoyer un message', desc: 'Contacter NETCY',               tab: 'messages' as Section, icon: MessageSquare },
            ].map(c => {
              const Icon = c.icon;
              return (
                <button key={c.label} onClick={() => goSection(c.tab)}
                  className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm text-left hover:shadow-md hover:-translate-y-0.5 transition-all group border border-transparent hover:border-surface-container">
                  {/* Cercle neutre — l'icône change de couleur au hover mais le fond reste gris */}
                  <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center mb-3 group-hover:bg-surface-container transition-colors">
                    <Icon size={20} className="text-on-surface-variant group-hover:text-on-surface transition-colors" />
                  </div>
                  <p className="font-semibold text-sm text-on-surface">{c.label}</p>
                  <p className="text-xs text-outline mt-0.5">{c.desc}</p>
                  <ChevronRight size={14} className="text-outline-variant mt-2 group-hover:translate-x-1 transition-transform" />
                </button>
              );
            })}
          </div>

          {/* Dernières factures */}
          {!loading && invoices.length > 0 && (
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader className="px-6 pt-6 pb-0 flex-row justify-between items-center">
                <CardTitle className="font-display text-lg text-on-surface">Dernières factures</CardTitle>
                <button onClick={() => goSection('factures')} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
                  Voir tout <ChevronRight size={12} />
                </button>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-3">
                {invoices.slice(0, 4).map(inv => (
                  <div key={inv.id} className="bg-surface rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold text-outline uppercase">{inv.numero_facture ?? `INV-${inv.id.slice(0, 8).toUpperCase()}`}</p>
                      <p className="font-display font-bold text-base text-on-surface mt-0.5">{inv.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                      <p className="text-xs text-outline">{new Date(inv.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    {invoiceBadge(inv.statut)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ══════════ PROJETS ══════════ */}
      {section === 'projets' && (
        <div key={`proj-${sectionKey.current}`} className="space-y-4 section-animate">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-on-surface">Mes Projets</h2>
              <p className="text-sm text-outline mt-0.5">{projects.length} projet{projects.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}</div>
          ) : projects.length === 0 ? (
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-16 text-center">
                <FolderOpen size={40} className="text-outline-variant mx-auto mb-4" />
                <p className="font-display font-bold text-lg text-on-surface">Aucun projet pour le moment</p>
                <p className="text-sm text-outline mt-1">Contactez-nous pour démarrer votre premier projet</p>
                <button onClick={() => goSection('messages')} className="btn-primary px-5 py-2.5 text-sm mt-4">
                  Contacter NETCY
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projects.map(p => (
                <Card key={p.id} className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                      <div>
                        <h3 className="font-display font-bold text-xl text-on-surface">{p.titre}</h3>
                        {p.description && <p className="text-sm text-outline mt-1 leading-relaxed">{p.description}</p>}
                        <p className="text-[10px] text-outline-variant mt-2 uppercase tracking-wider">
                          Créé le {new Date(p.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {statusBadge(p.status)}
                    </div>

                    {/* Barre de progression */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs text-outline">
                        <span>Progression globale</span>
                        <span className="font-display font-bold text-on-surface text-base">{p.progress}%</span>
                      </div>
                      <div className="bg-surface-container-low rounded-full h-2.5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#003EC7] to-[#0052FF] dark:from-[#b69df8] dark:to-[#d0bcff] transition-all duration-700" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>

                    {/* Phases */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Découverte',    done: p.progress >= 25 },
                        { label: 'Architecture',  done: p.progress >= 50 },
                        { label: 'UI Design',     done: p.progress >= 75 },
                        { label: 'Développement', done: p.progress >= 100 },
                      ].map(ph => (
                        <div key={ph.label} className={`rounded-xl p-2.5 text-center ${ph.done ? 'bg-[#EEF2FF] dark:bg-[#1a1f3d]' : 'bg-surface-container-low'}`}>
                          <p className="text-[9px] uppercase tracking-wider font-semibold text-outline">{ph.label}</p>
                          <p className={`font-bold text-xs mt-0.5 ${ph.done ? 'text-primary dark:text-[#d0bcff]' : 'text-outline-variant'}`}>
                            {ph.done ? '✓' : '—'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════ FACTURES ══════════ */}
      {section === 'factures' && (
        <div key={`fact-${sectionKey.current}`} className="space-y-4 section-animate">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-on-surface">Mes Factures</h2>
              <p className="text-sm text-outline mt-0.5">
                {invoices.length} facture{invoices.length !== 1 ? 's' : ''} · {totalPaid.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} payés
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}</div>
          ) : invoices.length === 0 ? (
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-16 text-center">
                <FileText size={40} className="text-outline-variant mx-auto mb-4" />
                <p className="font-display font-bold text-lg text-on-surface">Aucune facture</p>
                <p className="text-sm text-outline mt-1">Vos factures apparaîtront ici</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {invoices.map(inv => (
                <Card key={inv.id} className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Euro size={18} className="text-primary dark:text-[#d0bcff]" />
                        </div>
                        <div>
                          <p className="font-mono text-xs font-semibold text-on-surface-variant">
                            {inv.numero_facture ?? `INV-${inv.id.slice(0, 8).toUpperCase()}`}
                          </p>
                          <p className="text-sm text-outline mt-0.5">
                            {inv.description ?? 'Prestation NETCY'} · {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 space-y-1">
                        <p className="font-display font-bold text-xl text-on-surface">
                          {inv.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </p>
                        {invoiceBadge(inv.statut)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Total */}
              <Card className="border-0 bg-[#1A1C1E] dark:bg-surface-container rounded-2xl">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Total payé</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {invoices.filter(i => i.statut === 'payée' || i.statut === 'payee').length} facture(s) réglée(s)
                    </p>
                  </div>
                  <p className="font-display font-extrabold text-2xl text-white">
                    {totalPaid.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                </CardContent>
              </Card>

              {unpaidCount > 0 && (
                <Card className="border-0 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border-l-4 border-l-yellow-600 dark:border-l-yellow-400">
                  <CardContent className="p-4 flex items-center gap-3">
                    <AlertCircle size={18} className="text-yellow-700 dark:text-yellow-300 flex-shrink-0" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                      {unpaidCount} facture{unpaidCount > 1 ? 's' : ''} en attente de paiement. Contactez-nous si vous avez des questions.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════ MESSAGES ══════════ */}
      {section === 'messages' && (
        <div key={`msg-${sectionKey.current}`} className="space-y-4 section-animate">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-display font-bold text-2xl text-on-surface">Messages</h2>
              <p className="text-sm text-outline mt-0.5">Conversation directe avec NETCY</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="text-xs text-outline whitespace-nowrap">Jean-Marie Jung · En ligne</span>
            </div>
          </div>

          {/* Sélecteur de projet (si plusieurs projets) */}
          {projects.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {projects.map(p => (
                <button key={p.id} onClick={() => setActiveMsgProj(p.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${activeMsgProj === p.id ? 'bg-primary dark:bg-[#d0bcff] text-white dark:text-[#1D1B20]' : 'bg-surface-container-lowest text-outline hover:bg-surface-container-low'}`}>
                  {p.titre}
                </button>
              ))}
            </div>
          )}
          {projects.length === 0 && !loading && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
              <AlertCircle size={16} />
              Aucun projet assigné. La messagerie sera disponible dès qu'un projet vous sera attribué.
            </div>
          )}

          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 320px)', minHeight: '480px' }}>
            {/* Chat header */}
            <div className="bg-surface-container-lowest border-b border-surface-container-low px-5 py-4 flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 bg-surface-container-highest dark:bg-surface-container rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">JM</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-surface-container-lowest" />
              </div>
              <div>
                <p className="font-semibold text-sm text-on-surface">Jean-Marie Jung</p>
                <p className="text-[10px] text-outline uppercase tracking-wider">Fondateur & Développeur NETCY</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-surface">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-48 rounded-2xl" />
                  <Skeleton className="h-12 w-64 rounded-2xl ml-auto" />
                  <Skeleton className="h-12 w-56 rounded-2xl" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
                    <MessageSquare size={28} className="text-primary dark:text-[#d0bcff]" />
                  </div>
                  <p className="font-display font-bold text-lg text-on-surface">Commencez la conversation</p>
                  <p className="text-sm text-outline mt-1 max-w-xs">
                    Envoyez un message à Jean-Marie pour toute question sur votre projet.
                  </p>
                </div>
              ) : (
                messages
                  .filter(m => m.project_id === activeMsgProj || !activeMsgProj)
                  .map(m => {
                    const isMe = m.auteur === 'client';
                    return (
                      <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                        {!isMe && (
                          <div className="w-7 h-7 bg-surface-container-highest dark:bg-surface-container rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">JM</div>
                        )}
                        <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${isMe
                          ? 'bg-[#0052FF] text-white rounded-br-sm'
                          : 'bg-surface-container-lowest shadow-sm text-on-surface rounded-bl-sm'}`}>
                          <p className="text-sm leading-relaxed">{m.message}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-100 dark:text-[#b69df8] text-right' : 'text-outline-variant'}`}>
                            {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {isMe && (
                          <div className="w-7 h-7 bg-primary dark:bg-[#d0bcff] rounded-full flex items-center justify-center text-white dark:text-[#1D1B20] text-[10px] font-bold flex-shrink-0">
                            {userInitials}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-surface-container-lowest border-t border-surface-container-low px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <input
                type="text"
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Votre message à Jean-Marie..."
                className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#d0bcff]/20"
              />
              <button
                onClick={sendMessage}
                disabled={!msgInput.trim() || sending}
                className="w-10 h-10 bg-primary dark:bg-[#d0bcff] rounded-xl flex items-center justify-center hover:bg-primary-dark dark:hover:bg-[#b69df8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={15} className="text-white" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-outline-variant pt-4 border-t border-surface-container-low">
        <span>© {new Date().getFullYear()} NETCY — Jean-Marie Jung. Tous droits réservés.</span>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="/politique-confidentialite" className="hover:text-outline">Confidentialité</a>
          <a href="/cgu" className="hover:text-outline">CGU</a>
        </div>
      </footer>

      {/* ProfilePanel desktop (cloche système dans page.tsx) */}
      <ProfilePanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        userId={userId}
        onAvatarChange={(url) => setAvatarUrl(url)}
      />
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6">
      <div className="hidden lg:flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-52" />
          </div>
        </div>
        <Skeleton className="h-10 w-72 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-56 rounded-2xl" />
      <div className="grid sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <ClientDashboardInner />
    </Suspense>
  );
}
