import { useParams } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { balanceOf, childById, jeuActif, levelOf, progressionOf } from '../../state/selectors';
import { Lock, Sparkles, Star, Trophy } from 'lucide-react';

// E5 — Catalogue de récompenses avec progression et verrouillage par niveau (D6).
// Badge "OBJECTIF" sur la récompense du jeu actif. "Je veux !" quand débloquée hors jeu.
export default function E5Rewards() {
  const { childId } = useParams();
  const { state, dispatch } = useBonkoo();
  const child = childById(state, childId!)!;
  const balance = balanceOf(state, child.id);
  const niveau = levelOf(progressionOf(state, child.id));
  const game = jeuActif(state, child.id);
  const actives = state.récompenses.filter(r => r.actif);

  return (
    <div className="pt-2">
      <h2 className="font-display font-extrabold text-2xl mb-1">Mes récompenses</h2>
      <p className="text-sm text-bk-mute font-semibold mb-4">Demande-la quand elle est débloquée !</p>

      {game && (
        <div className="card p-2.5 mb-3 bg-bk-cream flex items-center gap-2 border-bk-primary">
          <div className="chip-primary"><Star size={10} /> Ton objectif</div>
          <div className="font-display font-bold text-sm">
            {state.récompenses.find(r => r.id === game.récompense_id)?.icône}{' '}
            {state.récompenses.find(r => r.id === game.récompense_id)?.nom}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {actives.map(r => {
          const lockedByLevel = r.niveau_requis > niveau;
          const isObjective = game?.récompense_id === r.id;
          const reachable = balance >= r.coût_points;
          const ratio = Math.min(100, Math.round((balance / r.coût_points) * 100));
          const remaining = Math.max(0, r.coût_points - balance);

          return (
            <div
              key={r.id}
              className={`card p-3 flex items-center gap-3 ${
                isObjective ? 'border-bk-accent shadow-popAccent' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-arcade border-2 border-bk-ink grid place-items-center text-2xl shrink-0 ${
                lockedByLevel ? 'bg-bk-cream grayscale' : 'bg-bk-accent'
              } ${reachable && !lockedByLevel ? 'animate-flame' : ''}`}>
                {r.icône}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-display font-bold text-sm text-bk-ink leading-none">{r.nom}</span>
                  {isObjective && (
                    <span className="chip-primary px-1.5 py-0.5 text-[9px]"><Star size={9} /> OBJECTIF</span>
                  )}
                  {!lockedByLevel && reachable && !isObjective && (
                    <span className="chip-xp px-1.5 py-0.5 text-[9px]">🔓 DÉBLOQUÉE !</span>
                  )}
                </div>
                <div className="h-2 rounded-full bg-bk-cream border-2 border-bk-ink overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isObjective ? 'bg-bk-accent' : 'bg-bk-gain'
                    }`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
                <div className="text-[10px] uppercase tracking-techno font-bold text-bk-mute mt-1">
                  {lockedByLevel
                    ? <span className="text-bk-level"><Trophy size={10} className="inline" /> Niveau {r.niveau_requis} requis</span>
                    : reachable
                      ? 'À toi !'
                      : `🔒 il te manque ${remaining} pts`
                  }
                </div>
              </div>
              {!lockedByLevel && reachable && !isObjective && !game && (
                <button
                  className="btn-gain text-xs px-3 py-2 shrink-0"
                  onClick={() => {
                    dispatch({ type: 'CREATE_GAME', childId: child.id, rewardId: r.id });
                  }}
                  title="Démarrer un jeu sur cette récompense"
                >
                  <Sparkles size={12} /> Je veux !
                </button>
              )}
              {lockedByLevel && <Lock className="text-bk-mute shrink-0" size={18} />}
            </div>
          );
        })}

        {actives.length === 0 && (
          <div className="card p-6 text-center bg-bk-cream">
            <div className="text-4xl mb-2">🎁</div>
            <div className="font-display font-extrabold text-base">Aucune récompense</div>
            <p className="text-sm text-bk-mute font-semibold mt-1">Demande à papa ou maman d'en ajouter !</p>
          </div>
        )}
      </div>
    </div>
  );
}
