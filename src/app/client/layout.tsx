'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, signOut, supabase } from '@/lib/supabase';
import { ProfilePanel } from '@/components/profile-panel';
import {
  LayoutDashboard, FolderOpen, FileText, MessageSquare,
  LogOut, Bell, X as XIcon, Euro, CheckCircle2,
} from 'lucide-react';

interface Notif { id: string; type: string; title: string; body: string; read: boolean; created_at: string; }

const NAV = [
  { label: 'Dashboard',    section: 'dashboard', icon: LayoutDashboard },
  { label: 'Mes Projets',  section: 'projets',   icon: FolderOpen },
  { label: 'Mes Factures', section: 'factures',  icon: FileText },
  { label: 'Messages',     section: 'messages',  icon: MessageSquare },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading]   = useState(true);
  const [userName, setUserName]         = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [notifs, setNotifs]             = useState<Notif[]>([]);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [userId, setUserId]             = useState('');
  const [unreadMsgs, setUnreadMsgs]     = useState(0);
  const [avatarUrl, setAvatarUrl]       = useState('');
  const notifRef = useRef<HTMLDivElement>(null);

  /* ── Récup active section depuis le pathname imbriqué via localStorage ── */
  /* On ne gère pas le routing ici, on délègue à page.tsx via un param ── */

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
        const ini = `${(cd.prenom ?? cd.nom ?? '?')[0]}${(cd.nom ?? '?')[0]}`.toUpperCase();
        setUserInitials(ini);
        if (cd.avatar_url) setAvatarUrl(cd.avatar_url);
      } else {
        const fallback = user.email?.split('@')[0] ?? 'CL';
        setUserName(fallback);
        setUserInitials(fallback.slice(0, 2).toUpperCase());
      }

      /* Notifs initiales */
      const { data: nd } = await supabase
        .from('notifications').select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (cancelled) return;
      if (nd) setNotifs(nd);

      /* Msgs non lus : compter les messages admin APRÈS le dernier passage dans Messages */
      const { data: clientProjs } = await supabase
        .from('projects').select('id').eq('client_id', user.id);
      if (cancelled) return;
      const projIds = (clientProjs ?? []).map(p => p.id);
      if (projIds.length > 0) {
        const lastView = localStorage.getItem('netcy_lastMsgsViewAt') ?? '0';
        const cutoffDate = new Date(parseInt(lastView)).toISOString();
        const { count } = await supabase
          .from('project_messages')
          .select('*', { count: 'exact', head: true })
          .in('project_id', projIds)
          .eq('auteur', 'admin')
          .gt('created_at', cutoffDate);
        if (cancelled) return;
        setUnreadMsgs(count ?? 0);
      }

      setLoading(false);

      /* Real-time notifs */
      supabase.channel('layout-notifs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => setNotifs(prev => [payload.new as Notif, ...prev]))
        .subscribe();

      /* Real-time messages admin → incrémenter badge */
      supabase.channel('layout-proj-msgs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_messages' },
          (payload) => {
            const msg = payload.new as { project_id: string; auteur: string };
            if (msg.auteur === 'admin' && projIds.includes(msg.project_id))
              setUnreadMsgs(n => n + 1);
          })
        .subscribe();
    };
    init();

    /* Écouter quand page.tsx marque les messages comme lus */
    const handleMsgsRead = () => setUnreadMsgs(0);
    window.addEventListener('netcy_msgs_read', handleMsgsRead);

    return () => {
      cancelled = true;
      window.removeEventListener('netcy_msgs_read', handleMsgsRead);
      supabase.removeChannel(supabase.channel('layout-notifs'));
      supabase.removeChannel(supabase.channel('layout-proj-msgs'));
    };
  }, [router]);

  /* Fermer notif au clic extérieur */
  useEffect(() => {
    if (!notifOpen) return;
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [notifOpen]);

  const unreadNotifs = notifs.filter(n => !n.read).length;

  const markNotifsRead = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    if (userId) await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary dark:border-[#d0bcff] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-outline">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-surface">

      {/* ═══ SIDEBAR FIXE ═══ */}
      <aside className="hidden lg:flex w-56 flex-col bg-surface-container-lowest fixed inset-y-0 left-0 z-30 border-r border-surface-container-low">
        <div className="px-5 pt-5 pb-4">
          <Link href="/">
            <img src="/images/logo_netcy_t.svg" alt="NETCY" className="h-9 w-auto logo-adaptive" />
          </Link>
          <p className="text-[10px] text-outline uppercase tracking-widest mt-1.5">Espace Client</p>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, section, icon: Icon }) => (
            <Link
              key={label}
              href={`/client?section=${section}`}
              onClick={() => {
                if (section === 'messages') {
                  setUnreadMsgs(0);
                  const now = Date.now();
                  localStorage.setItem('netcy_lastMsgsViewAt', now.toString());
                  window.dispatchEvent(new Event('netcy_msgs_read'));
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative text-on-surface-variant hover:bg-surface-container-low"
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
              {section === 'messages' && unreadMsgs > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-600 dark:bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold animate-pulse">
                  {unreadMsgs > 9 ? '9+' : unreadMsgs}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-6 border-t border-surface-container-low pt-4 space-y-0.5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-red-50 dark:hover:bg-[#450A0A] hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <LogOut size={16} strokeWidth={1.5} /> Déconnexion
          </button>

          {/* User card – cliquable → profil */}
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-3 px-3 py-3 mt-1 w-full hover:bg-surface-container-low rounded-xl transition-colors group text-left"
          >
            <div className="relative w-8 h-8 flex-shrink-0">
              {avatarUrl
                ? <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container dark:ring-surface-container-high" />
                : <div className="w-8 h-8 bg-primary dark:bg-[#d0bcff] rounded-full flex items-center justify-center text-white dark:text-[#1D1B20] text-xs font-bold">{userInitials}</div>
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary dark:group-hover:text-[#d0bcff] transition-colors">{userName}</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Client · Mon profil</p>
            </div>
          </button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Header : visible uniquement sur mobile (desktop = géré dans page.tsx) */}
        <header className="bg-surface-container-lowest border-b border-surface-container-low sticky top-0 z-20 lg:hidden">
          <div className="px-6 lg:px-10 h-14 flex items-center justify-between">
            {/* Mobile logo */}
            <Link href="/" className="lg:hidden font-display font-bold text-base text-on-surface">NETCY</Link>
            <div className="hidden lg:block" />

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setNotifOpen(o => !o); if (!notifOpen) markNotifsRead(); }}
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors"
                >
                  <Bell size={16} className="text-on-surface-variant" />
                  {unreadNotifs > 0 && (
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
                        Notifications {unreadNotifs > 0 && <span className="text-red-600 dark:text-red-400">({unreadNotifs})</span>}
                      </p>
                      <button onClick={() => setNotifOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-surface-container-low">
                        <XIcon size={13} className="text-outline" />
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-surface">
                      {notifs.length === 0 ? (
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
                    {notifs.length > 0 && (
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

              {/* Avatar cliquable → profil */}
              <button
                onClick={() => setProfileOpen(true)}
                className="relative w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/40 dark:hover:ring-[#d0bcff]/40 transition-all focus:outline-none"
                title="Mon profil"
              >
                {avatarUrl
                  ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-primary dark:bg-[#d0bcff] flex items-center justify-center text-white dark:text-[#1D1B20] text-xs font-bold">{userInitials}</div>
                }
              </button>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="lg:hidden flex overflow-x-auto gap-1 px-3 py-2 bg-surface-container-lowest border-b border-surface-container-low sticky top-14 z-10">
          {NAV.map(({ label, section, icon: Icon }) => (
            <Link key={label} href={`/client?section=${section}`}
              onClick={() => {
                if (section === 'messages') {
                  setUnreadMsgs(0);
                  const now = Date.now();
                  localStorage.setItem('netcy_lastMsgsViewAt', now.toString());
                  window.dispatchEvent(new Event('netcy_msgs_read'));
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap text-outline hover:bg-surface-container-low transition-all relative">
              <Icon size={14} />
              {label}
              {section === 'messages' && unreadMsgs > 0 && (
                <span className="w-4 h-4 bg-red-600 dark:bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadMsgs}</span>
              )}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap text-red-500 hover:bg-red-50 dark:hover:bg-[#450A0A] transition-all ml-auto"
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>

        <div className="flex-1">
          {children}
        </div>
      </main>

      {/* Profile panel */}
      <ProfilePanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        userId={userId}
        onAvatarChange={(url) => setAvatarUrl(url)}
      />
    </div>
  );
}
