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
        <div className="w-12 h-12 rounded-arcade bg-bk-warn text-white grid place-items-center border-[2.5px] border-bk-ink shadow-arcade">
          <AlertOctagon />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-white">Appliquer un malus</h1>
          <p className="text-bk-parentMute text-sm font-semibold">Conséquence douce. Ne touche jamais le niveau de progression.</p>
        </div>
      </div>

      <div className="card p-6 space-y-5">
        <div>
          <label className="label text-white font-display font-bold uppercase tracking-techno text-xs">Pour quel enfant ?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {state.enfants.map(c => {
              const on = childId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setChildId(c.id)}
                  className={`p-3 rounded-arcade border-[2.5px] text-bk-ink transition flex flex-col items-center gap-1 ${
                    on
                      ? 'border-bk-primary bg-bk-cream shadow-arcade'
                      : 'border-bk-ink bg-white'
                  }`}
                >
                  <div className="text-3xl">{c.avatar}</div>
                  <div className="font-display font-extrabold text-base">{c.prénom}</div>
                  <div className="text-[11px] uppercase tracking-techno font-bold text-bk-mute">{balanceOf(state, c.id)} pts</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label text-white font-display font-bold uppercase tracking-techno text-xs">Quel malus ?</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {state.malus.filter(m => m.actif).map(m => {
              const on = malusId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMalusId(m.id)}
                  className={`p-3 rounded-arcade border-[2.5px] flex items-center gap-3 text-left text-bk-ink transition ${
                    on
                      ? 'border-bk-primary bg-bk-cream shadow-arcade'
                      : 'border-bk-ink bg-white'
                  }`}
                >
                  <div className="text-3xl shrink-0">{m.icône}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-extrabold text-sm leading-tight">{m.nom}</div>
                    <div className="text-[11px] uppercase tracking-techno font-bold text-bk-mute mt-0.5">
                      {m.gravité} · {m.valeur_points} pts
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {state.malus.length === 0 && (
            <p className="text-sm text-bk-parentMute italic mt-2">Aucun malus actif. Va dans Bibliothèques pour en activer.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button className="btn-ghost flex-1 order-2 sm:order-1" onClick={() => navigate(-1)}>Annuler</button>
          <button className="btn-warn flex-1 order-1 sm:order-2" disabled={!childId || !malusId} onClick={apply}>
            Appliquer le malus
          </button>
        </div>

        {confirmed && (
          <div className="text-center text-sm text-bk-gain font-display font-bold">
            ✓ Malus appliqué. Le niveau de progression reste intact.
          </div>
        )}
      </div>
    </div>
  );
}
