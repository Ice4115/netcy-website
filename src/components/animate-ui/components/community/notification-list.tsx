'use client';

import * as React from 'react';
import { RotateCcw, ArrowUpRight, X, BellOff } from 'lucide-react';
import { motion, type Transition } from 'motion/react';

export interface NotifItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  count?: number;
}

interface NotificationListProps {
  notifications?: NotifItem[];
  onItemClick?: (id: string) => void;
  onViewAll?: () => void;
  onDismiss?: (id: string) => void;
}

/* ─── Données de démo ─────────────────────────────────────────────── */
const demoNotifications: NotifItem[] = [
  { id: '1', title: 'NPM Install Complete', subtitle: '1,227 packages added!', time: 'just now', count: 2 },
  { id: '2', title: 'Build Succeeded',      subtitle: 'Build finished in 12.34s', time: '1m 11s' },
  { id: '3', title: 'Lint Passed',          subtitle: 'No problems found',        time: '5m' },
];

/* ─── Widget démo : animation stacked hover ──────────────────────── */
const springT: Transition = { type: 'spring', stiffness: 300, damping: 26 };
const getCardVariants = (i: number) => ({
  collapsed: { marginTop: i === 0 ? 0 : -44, scaleX: 1 - i * 0.05 },
  expanded:  { marginTop: i === 0 ? 0 : 4,   scaleX: 1 },
});
const fadeT: Transition = { duration: 0.22, ease: 'easeInOut' };
const hideV = { collapsed: { opacity: 1, y: 0,   pointerEvents: 'auto'  as const }, expanded: { opacity: 0, y: -16, pointerEvents: 'none'  as const } };
const showV = { collapsed: { opacity: 0, y: 16, pointerEvents: 'none' as const }, expanded: { opacity: 1, y: 0,  pointerEvents: 'auto' as const } };

function DemoWidget() {
  return (
    <motion.div
      className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded-3xl w-xs space-y-3 shadow-md"
      initial="collapsed"
      whileHover="expanded"
    >
      <div>
        {demoNotifications.map((n, i) => (
          <motion.div
            key={n.id}
            className="bg-neutral-100 dark:bg-neutral-800 rounded-xl px-4 py-2 shadow-sm hover:shadow-lg transition-shadow duration-200 relative"
            variants={getCardVariants(i)}
            transition={springT}
            style={{ zIndex: demoNotifications.length - i }}
          >
            <div className="flex justify-between items-center">
              <h1 className="text-sm font-medium">{n.title}</h1>
              {n.count && (
                <div className="flex items-center text-xs gap-0.5 font-medium text-neutral-500 dark:text-neutral-300">
                  <RotateCcw className="size-3" /><span>{n.count}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-neutral-500 font-medium">
              <span>{n.time}</span>&nbsp;•&nbsp;<span>{n.subtitle}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="size-5 rounded-full bg-neutral-400 text-white text-xs flex items-center justify-center font-medium">
          {demoNotifications.length}
        </div>
        <span className="grid">
          <motion.span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 row-start-1 col-start-1" variants={hideV} transition={fadeT}>Notifications</motion.span>
          <motion.span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-1 cursor-pointer select-none row-start-1 col-start-1" variants={showV} transition={fadeT}>View all <ArrowUpRight className="size-4" /></motion.span>
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Liste interactive : simple, sans animation layout ─────────── */
function InteractiveList({ notifications, onItemClick, onViewAll, onDismiss }: Required<Pick<NotificationListProps, 'notifications'>> & Pick<NotificationListProps, 'onItemClick' | 'onViewAll' | 'onDismiss'>) {
  if (notifications.length === 0) {
    return (
      <div className="bg-neutral-200 dark:bg-neutral-900 p-5 rounded-3xl w-72 shadow-md flex flex-col items-center gap-2 text-center">
        <BellOff className="size-8 text-neutral-400" />
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Aucune notification</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded-3xl w-72 space-y-3 shadow-md">
      <div className="space-y-1.5">
        {notifications.map(n => (
          <div
            key={n.id}
            className="bg-neutral-100 dark:bg-neutral-800 rounded-xl px-4 py-2.5 shadow-sm flex items-start gap-3"
          >
            <button
              className="flex-1 text-left min-w-0"
              onClick={() => onItemClick?.(n.id)}
            >
              <p className="text-sm font-medium truncate">{n.title}</p>
              <p className="text-xs text-neutral-500 truncate">
                {n.time}&nbsp;•&nbsp;{n.subtitle}
              </p>
            </button>
            {onDismiss && (
              <button
                onClick={() => onDismiss(n.id)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mt-0.5 flex-shrink-0"
                aria-label="Ignorer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {onViewAll && (
        <div className="flex items-center gap-2">
          <div className="size-5 rounded-full bg-neutral-400 text-white text-xs flex items-center justify-center font-medium shrink-0">
            {notifications.length}
          </div>
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Voir tout <ArrowUpRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Export public ───────────────────────────────────────────────── */
function NotificationList({ notifications, onItemClick, onViewAll, onDismiss }: NotificationListProps) {
  /* Mode interactif si au moins un callback est fourni */
  if (onItemClick || onViewAll || onDismiss) {
    return (
      <InteractiveList
        notifications={notifications ?? []}
        onItemClick={onItemClick}
        onViewAll={onViewAll}
        onDismiss={onDismiss}
      />
    );
  }

  /* Mode démo : widget animé original */
  return <DemoWidget />;
}

export { NotificationList };
