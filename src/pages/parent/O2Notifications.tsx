import { useBonkoo } from '../../state/context';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

const formatRelative = (iso: string): string => {
  const ago = (Date.now() - new Date(iso).getTime()) / 1000;
  if (ago < 60) return 'à l\'instant';
  if (ago < 3600) return `il y a ${Math.floor(ago / 60)} min`;
  if (ago < 86400) return `il y a ${Math.floor(ago / 3600)} h`;
  return `il y a ${Math.floor(ago / 86400)} j`;
};

const iconByType: Record<string, string> = {
  declaration: '✋',
  jeu_créé: '🎲',
  reclamation: '🏆',
  default: '🔔',
};

export default function O2Notifications() {
  const { state, dispatch } = useBonkoo();
  const parentNotifs = state.notifications.filter(n => n.destinataire_type === 'parent');
  const unread = parentNotifs.filter(n => !n.lu).length;

  return (
    <div className="max-w-2xl mx-auto text-white">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
        <div className="flex items-center gap-3">
          <Bell className="text-bk-streak" />
          <h1 className="font-display font-extrabold text-3xl">
            Notifications {unread > 0 && <span className="text-bk-primary">· {unread}</span>}
          </h1>
        </div>
        <div className="flex gap-2">
          {unread > 0 && (
            <button className="btn-ghost text-sm" onClick={() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })}>
              <CheckCheck size={14} /> Tout marquer lu
            </button>
          )}
          {parentNotifs.length > 0 && (
            <button className="btn-ghost text-sm" onClick={() => dispatch({ type: 'CLEAR_NOTIFICATIONS' })}>
              <Trash2 size={14} /> Vider
            </button>
          )}
        </div>
      </div>
      <p className="text-bk-parentMute text-sm font-semibold mb-5">
        Activité du foyer dans l'ordre chronologique.
      </p>

      {parentNotifs.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-bk-cream text-bk-ink grid place-items-center text-3xl border-[2.5px] border-bk-ink shadow-arcade">
            🔔
          </div>
          <div className="font-display font-extrabold text-xl">Aucune notification</div>
          <p className="text-bk-parentMute text-sm font-semibold mt-1">
            Les déclarations, jeux et réclamations des enfants apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {parentNotifs.map(n => (
            <button
              key={n.id}
              onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', notificationId: n.id })}
              className={`card p-3 flex items-center gap-3 text-left w-full transition ${
                n.lu ? 'opacity-60' : 'border-bk-primary'
              }`}
            >
              <div className="w-10 h-10 rounded-arcade bg-bk-parentSurface border-2 border-bk-parentBorder grid place-items-center text-xl shrink-0">
                {iconByType[n.type] ?? iconByType.default}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm">{n.contenu}</div>
                <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
                  {formatRelative(n.créé_le)}{n.lu ? '' : ' · à approuver'}
                </div>
              </div>
              {!n.lu && <div className="w-2.5 h-2.5 rounded-full bg-bk-primary border border-bk-ink shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
