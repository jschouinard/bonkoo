import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { assignedBehaviorsFor, childById, rewardById } from '../../state/selectors';
import { ArrowLeft, Rocket } from 'lucide-react';

// E3 — Nouveau jeu, étape 2 : présentation des bonkoo (D5 : pas de sélection enfant)
export default function E3NewGameBonkoo() {
  const { childId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { state, dispatch } = useBonkoo();
  const child = childById(state, childId!)!;
  const rewardId = params.get('reward');
  const reward = rewardId ? rewardById(state, rewardId) : undefined;

  if (!reward) {
    navigate(`/child/${child.id}/new-game/reward`, { replace: true });
    return null;
  }

  const bonkoo = assignedBehaviorsFor(state, child.id);

  const start = () => {
    dispatch({ type: 'CREATE_GAME', childId: child.id, rewardId: reward.id });
    navigate(`/child/${child.id}/today`);
  };

  return (
    <div className="pt-2">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-bk-mute hover:text-bk-ink font-bold text-sm mb-3">
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 chip py-2 justify-center opacity-60">1 · Récompense 🎁</div>
        <div className="flex-1 chip-primary py-2 justify-center">2 · Bonkoo ✅</div>
      </div>

      {/* Récap récompense */}
      <div className="card p-3 mb-4 flex items-center gap-3 bg-bk-cream">
        <div className="w-11 h-11 rounded-arcade bg-bk-accent border-2 border-bk-ink grid place-items-center text-2xl shrink-0">
          {reward.icône}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-techno text-bk-mute font-bold">Ta récompense</div>
          <div className="font-display font-extrabold text-base text-bk-ink leading-none mt-0.5">{reward.nom}</div>
        </div>
        <div className="font-display font-extrabold text-lg text-bk-primary">{reward.coût_points} pts</div>
      </div>

      <h2 className="font-display font-extrabold text-2xl mb-1">Voici tes bonkoo ✅</h2>
      <p className="text-sm text-bk-mute font-semibold mb-4">Choisis par papa ou maman — chacun donne des points.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {bonkoo.map(b => (
          <div
            key={b.id}
            className="relative bg-amber-50 border-2 border-bk-primary rounded-arcadeLg p-3 flex flex-col items-center gap-1 shadow-popPrimary"
          >
            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-bk-primary text-white grid place-items-center font-bold text-xs border-2 border-bk-ink">✓</div>
            <div className="text-3xl">{b.icône}</div>
            <div className="font-display font-bold text-xs text-center text-bk-ink leading-tight">{b.nom}</div>
            <div className="font-display font-extrabold text-xs text-bk-primary">+{b.valeur_points}</div>
          </div>
        ))}
      </div>

      <div className="text-center text-[11px] uppercase tracking-techno text-bk-mute font-bold mb-3">
        {bonkoo.length} bonkoo dans ton jeu · choisis par ton parent
      </div>

      <button className="btn-primary w-full text-base" onClick={start}>
        C'est parti ! <Rocket size={18} />
      </button>
      <p className="text-center text-[11px] font-semibold text-bk-mute mt-2">
        Papa ou maman confirme ta récompense ⏳
      </p>
    </div>
  );
}
