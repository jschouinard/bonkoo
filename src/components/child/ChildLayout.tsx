import { Outlet, useParams, NavLink, useNavigate } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import ChildHeader from './ChildHeader';
import { balanceOf, progressionOf, streakOf, childById } from '../../state/selectors';
import { Home, Gift, Users, LogOut } from 'lucide-react';

const tab = ({ isActive }: { isActive: boolean }) =>
  `flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-display font-bold uppercase tracking-techno rounded-arcade transition ${
    isActive
      ? 'bg-bk-primary text-white border-[2.5px] border-bk-ink shadow-arcade'
      : 'bg-white text-bk-mute border-2 border-bk-ink/80 hover:bg-bk-cream'
  }`;

export default function ChildLayout() {
  const { childId } = useParams();
  const { state } = useBonkoo();
  const navigate = useNavigate();

  const child = childId ? childById(state, childId) : undefined;
  if (!child) return <div className="p-8 text-center">Profil introuvable. <button className="btn-primary mt-3" onClick={() => navigate('/')}>Retour</button></div>;

  const balance = balanceOf(state, child.id);
  const progression = progressionOf(state, child.id);
  const s = streakOf(state, child.id);

  return (
    <div className="min-h-screen flex flex-col shell-kid">
      <div className="p-3 md:p-6 max-w-3xl w-full mx-auto">
        <ChildHeader
          child={child}
          balance={balance}
          progression={progression}
          streak={s.longueur_actuelle}
          noMalusStreak={s.longueur_sans_malus}
        />
      </div>
      <main className="flex-1 max-w-3xl w-full mx-auto px-3 md:px-6 pb-28">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 p-3 bg-bk-cream/90 backdrop-blur border-t-[2.5px] border-bk-ink">
        <div className="max-w-3xl mx-auto flex items-stretch gap-2">
          <NavLink to={`/child/${child.id}/today`} className={tab}>
            <Home size={20} /> Aujourd'hui
          </NavLink>
          <NavLink to={`/child/${child.id}/rewards`} className={tab}>
            <Gift size={20} /> Récompenses
          </NavLink>
          <NavLink to={`/child/${child.id}/family`} className={tab}>
            <Users size={20} /> Famille
          </NavLink>
          <button
            className="px-3 py-3 bg-white text-bk-ink rounded-arcade border-2 border-bk-ink hover:bg-bk-cream"
            onClick={() => navigate('/')}
            title="Changer de profil"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>
    </div>
  );
}
