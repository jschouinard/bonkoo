import { useState } from 'react';
import { useBonkoo } from '../../state/context';
import { Plus, Power, Gift, Trophy } from 'lucide-react';
import type { RewardType } from '../../types';
import { NIVEAU_REQUIS_SUGGÉRÉ } from '../../types';

const ICONS = ['📱','🛝','🎁','🎬','🍦','🎨','⚽','🎮','🍕','🎲','🚲','📚'];
const TYPES: RewardType[] = ['privilège','sortie','objet','écran','autre'];

// Suggestion automatique : petite ≤ 30, moyenne 31-75, grande 76-150, épique > 150 (cf. brief §1 D6)
const suggérerNiveau = (coût: number): number => {
  if (coût <= 30) return NIVEAU_REQUIS_SUGGÉRÉ.petite;
  if (coût <= 75) return NIVEAU_REQUIS_SUGGÉRÉ.moyenne;
  if (coût <= 150) return NIVEAU_REQUIS_SUGGÉRÉ.grande;
  return NIVEAU_REQUIS_SUGGÉRÉ.épique;
};

export default function P7Rewards() {
  const { state, dispatch } = useBonkoo();
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ nom: '', icône: '🎁', type: 'objet' as RewardType, coût_points: 100, niveau_requis: 3 });

  const create = () => {
    if (!draft.nom.trim() || draft.coût_points <= 0) return;
    dispatch({ type: 'CREATE_REWARD', reward: draft });
    setCreating(false);
    setDraft({ ...draft, nom: '' });
  };

  return (
    <div className="max-w-4xl mx-auto text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Gift className="text-bk-primary" />
          <h1 className="font-display font-extrabold text-3xl text-white">Récompenses</h1>
        </div>
        <button className="btn-primary" onClick={() => setCreating(!creating)}>
          <Plus size={16} /> {creating ? 'Annuler' : 'Créer'}
        </button>
      </div>

      <p className="text-bk-parentMute text-sm font-semibold mb-4">
        Les enfants choisissent leur objectif ici.
      </p>

      {creating && (
        <div className="card p-4 mb-4 space-y-3">
          <div>
            <label className="label">Nom</label>
            <input
              className="input"
              value={draft.nom}
              onChange={e => setDraft({ ...draft, nom: e.target.value })}
              placeholder="Ex. Sortie au parc"
            />
          </div>
          <div>
            <label className="label">Icône (obligatoire)</label>
            <div className="flex flex-wrap gap-1.5">
              {ICONS.map(i => (
                <button
                  key={i}
                  onClick={() => setDraft({ ...draft, icône: i })}
                  className={`text-2xl w-11 h-11 rounded-arcade grid place-items-center border-[2.5px] transition ${
                    draft.icône === i ? 'border-bk-primary bg-bk-cream shadow-arcade' : 'border-bk-ink bg-white'
                  }`}
                >{i}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Type</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setDraft({ ...draft, type: t })}
                  className={`btn ${draft.type === t ? 'btn-primary' : 'btn-ghost'} capitalize text-sm py-1.5 px-3`}
                >{t}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Coût en points</label>
              <input
                className="input"
                type="number"
                value={draft.coût_points}
                min={1}
                onChange={e => {
                  const c = Number(e.target.value);
                  setDraft({ ...draft, coût_points: c, niveau_requis: suggérerNiveau(c) });
                }}
              />
            </div>
            <div>
              <label className="label">Niveau requis</label>
              <input
                className="input"
                type="number"
                value={draft.niveau_requis}
                min={1}
                onChange={e => setDraft({ ...draft, niveau_requis: Math.max(1, Number(e.target.value)) })}
              />
              <p className="text-[10px] uppercase tracking-techno font-bold text-bk-parentMute mt-1">
                Auto : {suggérerNiveau(draft.coût_points)} pour {draft.coût_points} pts
              </p>
            </div>
          </div>
          {/* Aperçu vu côté enfant */}
          <div>
            <label className="label">Aperçu (vu côté enfant)</label>
            <div className="card p-3 flex items-center gap-3 bg-bk-cream text-bk-ink">
              <div className="w-12 h-12 rounded-arcade bg-bk-accent border-2 border-bk-ink grid place-items-center text-2xl shrink-0">
                {draft.icône}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm">{draft.nom || 'Nom de la récompense'}</div>
                <div className="text-[11px] uppercase tracking-techno font-bold text-bk-primary mt-0.5">
                  {draft.coût_points} pts · Niv. {draft.niveau_requis}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="btn-ghost flex-1" onClick={() => setCreating(false)}>Annuler</button>
            <button className="btn-primary flex-1" onClick={create} disabled={!draft.nom.trim()}>
              <Plus size={16} /> Créer
            </button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {state.récompenses.length === 0 && (
          <div className="card p-8 text-center col-span-full">
            <div className="text-4xl mb-2">🎁</div>
            <div className="font-display font-extrabold text-lg">Aucune récompense</div>
            <p className="text-bk-parentMute text-sm font-semibold mt-1">
              Les enfants ne peuvent pas démarrer un jeu sans récompense à viser.
            </p>
          </div>
        )}
        {state.récompenses.map(r => (
          <div key={r.id} className={`card p-3 ${!r.actif ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-arcade bg-bk-accent border-2 border-bk-ink grid place-items-center text-xl shrink-0">
                {r.icône}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm">{r.nom}</div>
                <div className="text-[10px] uppercase tracking-techno font-bold text-bk-parentMute">{r.type}</div>
              </div>
              <button
                onClick={() => dispatch({ type: 'UPDATE_REWARD', rewardId: r.id, patch: { actif: !r.actif } })}
                className="text-bk-parentMute hover:text-white"
                title={r.actif ? 'Désactiver' : 'Activer'}
              >
                <Power size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="font-display font-extrabold text-xl text-bk-accent">{r.coût_points} pts</div>
              <div className="flex items-center gap-1 text-[11px] uppercase tracking-techno font-bold text-bk-level">
                <Trophy size={11} /> Niv. {r.niveau_requis}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
