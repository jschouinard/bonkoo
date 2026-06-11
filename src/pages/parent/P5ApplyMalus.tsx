import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { balanceOf } from '../../state/selectors';
import { AlertOctagon } from 'lucide-react';

export default function P5ApplyMalus() {
  const { state, dispatch } = useBonkoo();
  const navigate = useNavigate();
  const parentId = state.parents[0]?.id ?? 'p-1';
  const [childId, setChildId] = useState<string>(state.enfants[0]?.id ?? '');
  const [malusId, setMalusId] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);

  const apply = () => {
    if (!childId || !malusId) return;
    dispatch({ type: 'APPLY_MALUS', childId, malusId, parentId });
    setConfirmed(true);
    setTimeout(() => navigate('/parent/dashboard'), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-violet-100 text-bk-warn grid place-items-center">
          <AlertOctagon />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Appliquer un malus</h1>
          <p className="text-bk-mute text-sm">Conséquence douce. Ne touche jamais le niveau de progression.</p>
        </div>
      </div>

      <div className="card p-6 space-y-5">
        <div>
          <label className="label">Pour quel enfant ?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {state.enfants.map(c => (
              <button
                key={c.id}
                onClick={() => setChildId(c.id)}
                className={`p-3 rounded-xl border ${childId === c.id ? 'border-bk-primary bg-bk-sand' : 'border-bk-line bg-white'}`}
              >
                <div className="text-3xl">{c.avatar}</div>
                <div className="font-semibold">{c.prénom}</div>
                <div className="text-xs text-bk-mute">{balanceOf(state, c.id)} pts</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Quel malus ?</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {state.malus.filter(m => m.actif).map(m => (
              <button
                key={m.id}
                onClick={() => setMalusId(m.id)}
                className={`p-3 rounded-xl border flex items-center gap-3 text-left ${malusId === m.id ? 'border-bk-primary bg-bk-sand' : 'border-bk-line bg-white'}`}
              >
                <div className="text-3xl">{m.icône}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{m.nom}</div>
                  <div className="text-xs text-bk-mute capitalize">{m.gravité} · {m.valeur_points} pts</div>
                </div>
              </button>
            ))}
          </div>
          {state.malus.length === 0 && (
            <p className="text-sm text-bk-mute italic mt-2">Aucun malus actif. Va dans Bibliothèques pour en activer.</p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button className="btn-ghost flex-1" onClick={() => navigate(-1)}>Annuler</button>
          <button className="btn-warn flex-1" disabled={!childId || !malusId} onClick={apply}>
            Appliquer le malus
          </button>
        </div>

        {confirmed && (
          <div className="text-center text-sm text-bk-gainDark font-medium">
            ✓ Malus appliqué. Le niveau de progression reste intact.
          </div>
        )}
      </div>
    </div>
  );
}
