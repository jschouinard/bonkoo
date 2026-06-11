import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useBonkoo } from '../../state/context';
import NipModal from '../common/NipModal';
import { Home, CheckSquare, Library, Gift, LogOut, AlertOctagon } from 'lucide-react';

const navItem = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
    isActive ? 'bg-bk-sand text-bk-ink' : 'text-bk-mute hover:bg-bk-sand/60'
  }`;

export default function ParentLayout() {
  const { state } = useBonkoo();
  const navigate = useNavigate();
  const location = useLocation();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('bk:unlocked') === '1');
  const [askNip, setAskNip] = useState(false);

  useEffect(() => {
    // Si pas de NIP encore défini (onboarding pas fini) on laisse passer
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {!onboarding && (
        <aside className="md:w-64 bg-white border-r border-bk-line p-4 md:min-h-screen">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-bk-primary text-white grid place-items-center font-bold text-lg">B</div>
            <div>
              <div className="font-bold leading-tight">Bonkoo</div>
              <div className="text-xs text-bk-mute">{state.famille.nom}</div>
            </div>
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            <NavLink to="/parent/dashboard" className={navItem}><Home size={16} /> Accueil</NavLink>
            <NavLink to="/parent/approvals" className={navItem}>
              <CheckSquare size={16} /> Approbations
              {state.occurrences.filter(o => o.statut === 'déclaré').length + state.échanges.filter(e => e.statut === 'demandé').length > 0 && (
                <span className="ml-auto chip bg-bk-primary text-white">
                  {state.occurrences.filter(o => o.statut === 'déclaré').length + state.échanges.filter(e => e.statut === 'demandé').length}
                </span>
              )}
            </NavLink>
            <NavLink to="/parent/malus" className={navItem}><AlertOctagon size={16} /> Appliquer un malus</NavLink>
            <NavLink to="/parent/library" className={navItem}><Library size={16} /> Bibliothèques</NavLink>
            <NavLink to="/parent/rewards" className={navItem}><Gift size={16} /> Récompenses</NavLink>
          </nav>
          <div className="mt-6 md:absolute md:bottom-4 md:w-56">
            <button
              className="btn-ghost w-full"
              onClick={() => { sessionStorage.removeItem('bk:unlocked'); navigate('/'); }}
            >
              <LogOut size={16} /> Quitter le mode parent
            </button>
          </div>
        </aside>
      )}
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
