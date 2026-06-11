import { useParams } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { balanceOf, childById, rewardById } from '../../state/selectors';
import { Lock, Sparkles, Hourglass } from 'lucide-react';

export default function E2Rewards() {
  const { childId } = useParams();
  const { state, dispatch } = useBonkoo();
  const child = childById(state, childId!)!;
  const balance = balanceOf(state, child.id);
  const actives = state.récompenses.filter(r => r.actif);

  // L'enfant ne peut avoir qu'une seule demande "en attente" à la fois
  const pending = state.échanges.find(e => e.enfant_id === child.id && e.statut === 'demandé');
  const pendingReward = pending ? rewardById(state, pending.récompense_id) : undefined;

  const request = (rId: string) => {
    if (pending) return;
    dispatch({ type: 'REQUEST_REDEEM', childId: child.id, rewardId: rId });
  };

  return (
    <div className="pt-2">
      <h2 className="text-xl font-extrabold mb-3">Récompenses</h2>

      {pending && pendingReward && (
        <div className="card p-3 mb-3 flex items-center gap-3 bg-bk-sand border-bk-accent/40 animate-pop">
          <div className="text-3xl">{pendingReward.icône}</div>
          <div className="flex-1">
            <div className="font-bold text-sm">Tu as demandé : {pendingReward.nom}</div>
            <div className="text-xs text-bk-mute">Tes parents vont confirmer.</div>
          </div>
          <Sparkles className="text-bk-accent" />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {actives.map(r => {
          const locked = balance < r.coût_points;
          const remaining = r.coût_points - balance;
          const ratio = Math.min(100, Math.round((balance / r.coût_points) * 100));
          const isPendingThis = pending?.récompense_id === r.id;
          const blockedByOther = !!pending && !isPendingThis;

          return (
            <div key={r.id} className={`card p-4 relative ${blockedByOther ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`text-5xl ${locked ? 'grayscale' : ''}`}>{r.icône}</div>
                <div className="flex-1">
                  <div className="font-bold text-base">{r.nom}</div>
                  <div className="text-sm text-bk-primary font-extrabold">{r.coût_points} pts</div>
                </div>
                {locked && !isPendingThis && <Lock className="text-bk-mute" size={18} />}
              </div>

              <div className="h-2 rounded-full bg-bk-line overflow-hidden mb-2">
                <div className="h-full bg-bk-primary transition-all duration-500" style={{ width: `${ratio}%` }} />
              </div>

              {isPendingThis ? (
                <button className="btn-soft w-full text-base cursor-default" disabled>
                  <Hourglass size={16} /> En attente du parent…
                </button>
              ) : locked ? (
                <div className="text-xs text-bk-mute font-bold">Il te manque {remaining} pts</div>
              ) : (
                <button
                  className="btn-accent w-full text-base"
                  onClick={() => request(r.id)}
                  disabled={blockedByOther}
                  title={blockedByOther ? 'Tu as déjà une demande en cours' : undefined}
                >
                  Je veux celle-là !
                </button>
              )}
            </div>
          );
        })}
        {actives.length === 0 && (
          <div className="text-bk-mute italic col-span-full text-center py-10">
            Aucune récompense pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
