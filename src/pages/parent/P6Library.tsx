import { useState } from 'react';
import { useBonkoo } from '../../state/context';
import { systemBehaviors, systemMalus } from '../../data/seed';
import { Plus, Check, Power, Library } from 'lucide-react';
import type { Routine } from '../../types';

const ICONS = ['🪥','👕','🥞','🍱','🍽️','🛏️','🧸','🛁','🎒','🌙','👂','🗣️','🧘','🤝','📚','🥦','🚴','🎵','🎨'];

const ROUTINE_OPTIONS: { key: Routine; label: string; emoji: string }[] = [
  { key: 'matin', label: 'Matin',    emoji: '🌅' },
  { key: 'midi',  label: 'Midi',     emoji: '☀️' },
  { key: 'soir',  label: 'Soir',     emoji: '🌙' },
  { key: 'libre', label: 'Toujours', emoji: '⭐' },
];

export default function P6Library() {
  const { state, dispatch } = useBonkoo();
  const [tab, setTab] = useState<'comportements' | 'malus'>('comportements');
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    type: 'tâche' as 'tâche' | 'consigne',
    nom: '',
    icône: '✨',
    taille: 'moyenne' as 'petite' | 'moyenne' | 'grande',
    valeur_points: 10,
    récurrence: 'quotidienne' as 'quotidienne' | 'jours_précis' | 'unique',
    jours_actifs: [] as ('lun'|'mar'|'mer'|'jeu'|'ven'|'sam'|'dim')[],
    routine: 'libre' as Routine,
  });

  const activeIds = new Set(state.comportements.map(b => b.nom));
  const activeMalusNames = new Set(state.malus.map(m => m.nom));

  const create = () => {
    if (!draft.nom.trim()) return;
    dispatch({ type: 'CREATE_BEHAVIOR', behavior: draft });
    setCreating(false);
    setDraft({ ...draft, nom: '' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Library className="text-bk-primary" />
        <h1 className="text-2xl font-bold">Bibliothèques</h1>
      </div>
      <p className="text-bk-mute text-sm mb-4">Modèles système et bibliothèque de ton foyer.</p>

      <div className="flex gap-2 mb-4">
        <button className={`btn ${tab === 'comportements' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('comportements')}>Comportements</button>
        <button className={`btn ${tab === 'malus' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('malus')}>Malus</button>
      </div>

      {tab === 'comportements' && (
        <>
          <section className="mb-6">
            <h2 className="font-semibold mb-2">Mes comportements actifs</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {state.comportements.length === 0 && (
                <div className="text-bk-mute italic">Aucun. Active des modèles ci-dessous ou crée-en un.</div>
              )}
              {state.comportements.map(b => (
                <div key={b.id} className={`card p-3 flex items-center gap-3 ${!b.actif && 'opacity-50'}`}>
                  <div className="text-3xl">{b.icône}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{b.nom}</div>
                    <div className="text-xs text-bk-mute capitalize">{b.type} · {b.taille} · {b.valeur_points} pts</div>
                  </div>
                  <button className="text-bk-mute hover:text-bk-ink" title={b.actif ? 'Désactiver' : 'Activer'} onClick={() => dispatch({ type: 'TOGGLE_FAMILY_BEHAVIOR', behaviorId: b.id })}>
                    <Power size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Modèles fournis</h2>
              <button className="btn-soft text-sm" onClick={() => setCreating(!creating)}>
                <Plus size={14} /> Créer un comportement
              </button>
            </div>

            {creating && (
              <div className="card p-4 mb-3 space-y-3">
                <div className="flex gap-2">
                  <button className={`btn ${draft.type === 'tâche' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setDraft({ ...draft, type: 'tâche' })}>Tâche</button>
                  <button className={`btn ${draft.type === 'consigne' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setDraft({ ...draft, type: 'consigne' })}>Consigne</button>
                </div>
                <div>
                  <label className="label">Nom</label>
                  <input className="input" value={draft.nom} onChange={e => setDraft({ ...draft, nom: e.target.value })} placeholder="Ex. Lire 10 min" />
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
                <div className="grid grid-cols-3 gap-2">
                  {(['petite','moyenne','grande'] as const).map(t => {
                    const v = t === 'petite' ? 5 : t === 'moyenne' ? 10 : 20;
                    return (
                      <button key={t}
                        onClick={() => setDraft({ ...draft, taille: t, valeur_points: v })}
                        className={`p-3 rounded-xl border ${draft.taille === t ? 'border-bk-primary bg-bk-sand' : 'border-bk-line bg-white'}`}
                      >
                        <div className="font-semibold capitalize">{t}</div>
                        <div className="text-xs text-bk-mute">{v} pts (modifiable)</div>
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label className="label">Valeur en points</label>
                  <input className="input" type="number" value={draft.valeur_points} onChange={e => setDraft({ ...draft, valeur_points: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="label">Moment de la journée</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ROUTINE_OPTIONS.map(r => (
                      <button
                        key={r.key}
                        onClick={() => setDraft({ ...draft, routine: r.key })}
                        className={`p-2 rounded-xl border-2 text-sm font-bold ${draft.routine === r.key ? 'border-bk-primary bg-bk-primaryLight text-bk-primaryDark' : 'border-bk-line bg-white text-bk-mute'}`}
                      >
                        <div className="text-xl">{r.emoji}</div>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-ghost flex-1" onClick={() => setCreating(false)}>Annuler</button>
                  <button className="btn-primary flex-1" onClick={create} disabled={!draft.nom.trim()}>Créer</button>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-2">
              {systemBehaviors.map(b => {
                const already = activeIds.has(b.nom);
                return (
                  <div key={b.id} className="card p-3 flex items-center gap-3">
                    <div className="text-3xl">{b.icône}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{b.nom}</div>
                      <div className="text-xs text-bk-mute capitalize">{b.type} · {b.taille} · {b.valeur_points} pts</div>
                    </div>
                    {already ? (
                      <span className="chip"><Check size={12} /> Activé</span>
                    ) : (
                      <button className="btn-soft text-sm" onClick={() => dispatch({ type: 'ACTIVATE_SYSTEM_BEHAVIOR', sysBehaviorId: b.id })}>
                        Activer
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {tab === 'malus' && (
        <>
          <section className="mb-6">
            <h2 className="font-semibold mb-2">Mes malus actifs</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {state.malus.length === 0 && <div className="text-bk-mute italic">Aucun.</div>}
              {state.malus.map(m => (
                <div key={m.id} className="card p-3 flex items-center gap-3">
                  <div className="text-3xl">{m.icône}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{m.nom}</div>
                    <div className="text-xs text-bk-mute capitalize">{m.gravité} · {m.valeur_points} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Modèles fournis</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {systemMalus.map(m => {
                const already = activeMalusNames.has(m.nom);
                return (
                  <div key={m.id} className="card p-3 flex items-center gap-3">
                    <div className="text-3xl">{m.icône}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{m.nom}</div>
                      <div className="text-xs text-bk-mute capitalize">{m.gravité} · {m.valeur_points} pts</div>
                    </div>
                    {already ? (
                      <span className="chip"><Check size={12} /> Activé</span>
                    ) : (
                      <button className="btn-soft text-sm" onClick={() => dispatch({ type: 'ACTIVATE_SYSTEM_MALUS', sysMalusId: m.id })}>
                        Activer
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
