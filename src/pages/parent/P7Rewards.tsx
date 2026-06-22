import { useState } from 'react';
import { useBonkoo } from '../../state/context';
import { Plus, Power, Gift } from 'lucide-react';
import type { RewardType } from '../../types';

const ICONS = ['📱','🛝','🎁','🎬','🍦','🎨','⚽','🎮','🍕','🎲','🚲','📚'];
const TYPES: RewardType[] = ['privilège','sortie','objet','écran','autre'];

export default function P7Rewards() {
  const { state, dispatch } = useBonkoo();
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ nom: '', icône: '🎁', type: 'objet' as RewardType, coût_points: 100, niveau_requis: 1 });

  const create = () => {
    if (!draft.nom.trim() || draft.coût_points <= 0) return;
    dispatch({ type: 'CREATE_REWARD', reward: draft });
    setCreating(false);
    setDraft({ ...draft, nom: '' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Gift className="text-bk-primary" />
          <h1 className="text-2xl font-bold">Catalogue de récompenses</h1>
        </div>
        <button className="btn-primary" onClick={() => setCreating(!creating)}>
          <Plus size={16} /> Créer
        </button>
      </div>

      {creating && (
        <div className="card p-4 mb-4 space-y-3">
          <div>
            <label className="label">Nom</label>
            <input className="input" value={draft.nom} onChange={e => setDraft({ ...draft, nom: e.target.value })} placeholder="Ex. 30 min d'écran" />
          </div>
          <div>
            <label className="label">Icône (obligatoire)</label>
            <div className="flex flex-wrap gap-1">
              {ICONS.map(i => (
                <button key={i} onClick={() => setDraft({ ...draft, icône: i })}
                  className={`text-2xl w-10 h-10 rounded-xl grid place-items-center border ${draft.icône === i ? 'border-bk-primary bg-bk-sand' : 'border-bk-line bg-white'}`}>{i}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Type</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button key={t} onClick={() => setDraft({ ...draft, type: t })}
                  className={`btn ${draft.type === t ? 'btn-primary' : 'btn-ghost'} capitalize`}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Coût en points</label>
            <input className="input" type="number" value={draft.coût_points} min={1} onChange={e => setDraft({ ...draft, coût_points: Number(e.target.value) })} />
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost flex-1" onClick={() => setCreating(false)}>Annuler</button>
            <button className="btn-primary flex-1" onClick={create}>Créer la récompense</button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {state.récompenses.length === 0 && (
          <div className="text-bk-mute italic col-span-full">Aucune récompense. Crée-en une pour rendre la boucle motivante.</div>
        )}
        {state.récompenses.map(r => (
          <div key={r.id} className={`card p-4 ${!r.actif && 'opacity-50'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-4xl">{r.icône}</div>
              <div className="flex-1">
                <div className="font-bold">{r.nom}</div>
                <div className="text-xs text-bk-mute capitalize">{r.type}</div>
              </div>
              <button onClick={() => dispatch({ type: 'UPDATE_REWARD', rewardId: r.id, patch: { actif: !r.actif } })} className="text-bk-mute hover:text-bk-ink" title={r.actif ? 'Désactiver' : 'Activer'}>
                <Power size={16} />
              </button>
            </div>
            <div className="text-bk-primary font-bold text-xl">{r.coût_points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}
