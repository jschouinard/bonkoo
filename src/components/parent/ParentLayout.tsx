import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useBonkoo } from '../../state/context';
import NipModal from '../common/NipModal';
import {
  pendingGameCreations, pendingGameClaims,
  allPendingApprovals, pendingRedeems,
} from '../../state/selectors';
import { Home, CheckSquare, Library, Gift, LogOut, AlertOctagon, Bell, Settings } from 'lucide-react';

const navItem = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2.5 rounded-arcade text-sm font-display font-bold transition whitespace-nowrap shrink-0 ${
    isActive
      ? 'bg-bk-primary text-white border-2 border-bk-ink shadow-arcade'
      : 'text-bk-parentLight hover:bg-bk-parentSurface border-2 border-transparent'
  }`;

export default function ParentLayout() {
  const { state } = useBonkoo();
  const navigate = useNavigate();
  const location = useLocation();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('bk:unlocked') === '1');
  const [askNip, setAskNip] = useState(false);

  useEffect(() => {
    if (!state.famille.nip || !state.onboarding_terminé) {
      setUnlocked(true);
      return;
    }
    if (!unlocked) setAskNip(true);
  }, [state.famille.nip, state.onboarding_terminé, unlocked, location.pathname]);

  if (!unlocked) {
    return (
      <NipModal
        open={askNip}
        onClose={() => navigate('/')}
        onSuccess={() => { sessionStorage.setItem('bk:unlocked', '1'); setUnlocked(true); setAskNip(false); }}
      />
    );
  }

  const onboarding = !state.onboarding_terminé;
  const pendingCount =
    allPendingApprovals(state).length +
    pendingRedeems(state).length +
    pendingGameCreations(state).length +
    pendingGameClaims(state).length;
  const unreadNotifs = state.notifications.filter(n => n.destinataire_type === 'parent' && !n.lu).length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row shell-parent">
      {!onboarding && (
        <aside className="md:w-64 bg-bk-parentSurface border-r-2 border-bk-parentBorder p-4 md:min-h-screen relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-arcade bg-bk-primary text-white grid place-items-center font-display font-extrabold text-2xl border-[2.5px] border-bk-ink shadow-arcade leading-none">b</div>
            <div>
              <div className="wordmark text-2xl text-white">bonkoo</div>
              <div className="text-[11px] font-bold uppercase tracking-techno text-bk-parentMute mt-0.5">{state.famille.nom}</div>
            </div>
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            <NavLink to="/parent/dashboard" className={navItem}><Home size={16} /> Accueil</NavLink>
            <NavLink to="/parent/approvals" className={navItem}>
              <CheckSquare size={16} /> Approbations
              {pendingCount > 0 && (
                <span className="ml-auto chip bg-bk-primary text-white">{pendingCount}</span>
              )}
            </NavLink>
            <NavLink to="/parent/notifications" className={navItem}>
              <Bell size={16} /> Notifications
              {unreadNotifs > 0 && (
                <span className="ml-auto chip bg-bk-streak text-white">{unreadNotifs}</span>
              )}
            </NavLink>
            <NavLink to="/parent/malus" className={navItem}><AlertOctagon size={16} /> Appliquer un malus</NavLink>
            <NavLink to="/parent/library" className={navItem}><Library size={16} /> Bibliothèques</NavLink>
            <NavLink to="/parent/rewards" className={navItem}><Gift size={16} /> Récompenses</NavLink>
            <NavLink to="/parent/settings" className={navItem}><Settings size={16} /> Réglages</NavLink>
          </nav>
          <div className="mt-6 md:absolute md:bottom-4 md:left-4 md:right-4">
            <button
              className="btn-ghost w-full"
              onClick={() => { sessionStorage.removeItem('bk:unlocked'); navigate('/'); }}
            >
              <LogOut size={16} /> Quitter
            </button>
          </div>
        </aside>
      )}
      <main className="flex-1 p-4 md:p-8 text-white">
        <Outlet />
      </main>
    </div>
  );
}
