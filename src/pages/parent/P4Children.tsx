import { useState } from 'react';
import { useBonkoo } from '../../state/context';
import {
  balanceOf, progressionOf, streakOf, levelOf, assignedBehaviorsFor,
} from '../../state/selectors';
import { Users, Pencil, Plus, Trash2, Check, X } from 'lucide-react';
import type { ModeInterface } from '../../types';

const AVATARS = ['🦁','🦊','🐼','🐯','🐸','🐰','🐨','🦄','🐶','🐱','🐵','🐧','🦒','🐢','🦋','🐝'];

// P4 — Édition prénom + avatar + assignations bonkoo
export default function P4Children() {
  const { state, dispatch } = useBonkoo();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<{ prénom: string; avatar: string; mode_interface: ModeInterface }>({
    prénom: '',
    avatar: AVATARS[0]!,
    mode_interface: 'texte',
  });

  const startEdit = (childId: string) => {
    const c = state.enfants.find(x => x.id === childId);
    if (!c) return;
    setDraft({ prénom: c.prénom, avatar: c.avatar, mode_interface: c.mode_interface });
    setEditing(childId);
    setAdding(false);
  };

  const saveEdit = () => {
    if (!editing || !draft.prénom.trim()) return;
    dispatch({ type: 'UPDATE_CHILD', childId: editing, patch: draft });
    setEditing(null);
  };

  const addChild = () => {
    if (!draft.prénom.trim()) return;
    dispatch({ type: 'ADD_CHILD', child: draft });
    setAdding(false);
    setDraft({ prénom: '', avatar: AVATARS[(state.enfants.length + 1) % AVATARS.length]!, mode_interface: 'texte' });
  };

  return (
    <div className="max-w-2xl mx-auto text-white">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <div className="flex items-center gap-3">
          <Users className="text-bk-primary" />
          <h1 className="font-display font-extrabold text-3xl">Les enfants</h1>
        </div>
        <button
          className="btn-primary"
          onClick={() => { setAdding(!adding); setEditing(null); setDraft({ prénom: '', avatar: AVATARS[state.enfants.length % AVATARS.length]!, mode_interface: 'texte' }); }}
        >
          <Plus size={16} /> {adding ? 'Annuler' : 'Ajouter'}
        </button>
      </div>
      <p className="text-bk-parentMute text-sm font-semibold mb-5">
        Modifie le prénom et l'avatar à tout moment.
      </p>

      {adding && (
        <div className="card p-4 mb-3 border-bk-primary">
          <EditForm
            draft={draft}
            onChange={setDraft}
            onCancel={() => setAdding(false)}
            onSave={addChild}
            isNew
          />
        </div>
      )}

      <div className="space-y-3">
        {state.enfants.map(c => {
          if (editing === c.id) {
            return (
              <div key={c.id} className="card p-4 border-bk-primary">
                <EditForm
                  draft={draft}
                  onChange={setDraft}
                  onCancel={() => setEditing(null)}
                  onSave={saveEdit}
                  onDelete={() => {
                    if (confirm(`Retirer ${c.prénom} du foyer ?`)) {
                      dispatch({ type: 'REMOVE_CHILD', childId: c.id });
                      setEditing(null);
                    }
                  }}
                />
              </div>
            );
          }
          const niveau = levelOf(progressionOf(state, c.id));
          const série = streakOf(state, c.id).longueur_actuelle;
          const balance = balanceOf(state, c.id);
          const bonkooCount = assignedBehaviorsFor(state, c.id).length;
          return (
            <div key={c.id} className="card p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-arcade bg-bk-level border-2 border-bk-ink grid place-items-center text-2xl shrink-0">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-extrabold text-lg leading-none">{c.prénom}</div>
                <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-1">
                  Niv. {niveau} · {balance} pts · 🔥 {série} · {bonkooCount} bonkoo
                </div>
              </div>
              <button
                onClick={() => startEdit(c.id)}
                className="px-3 py-2 rounded-arcade bg-bk-accent text-bk-ink border-2 border-bk-ink shadow-arcade font-display font-bold text-xs hover:bg-bk-accentDark"
                title="Modifier"
              >
                <Pencil size={14} className="inline" /> Modifier
              </button>
            </div>
          );
        })}

        {state.enfants.length === 0 && !adding && (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-2">👶</div>
            <div className="font-display font-extrabold text-lg">Aucun enfant</div>
            <p className="text-bk-parentMute text-sm font-semibold mt-1">
              Ajoute au moins un enfant pour démarrer les jeux.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Formulaire d'édition / création ─────────────────────────────────────
function EditForm({
  draft, onChange, onCancel, onSave, isNew, onDelete,
}: {
  draft: { prénom: string; avatar: string; mode_interface: ModeInterface };
  onChange: (d: { prénom: string; avatar: string; mode_interface: ModeInterface }) => void;
  onCancel: () => void;
  onSave: () => void;
  isNew?: boolean;
  onDelete?: () => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label text-white text-xs uppercase tracking-techno">Prénom</label>
        <input
          autoFocus
          className="input font-display font-extrabold text-lg"
          value={draft.prénom}
          onChange={e => onChange({ ...draft, prénom: e.target.value })}
          placeholder="Léa"
        />
      </div>
      <div>
        <label className="label text-white text-xs uppercase tracking-techno">Avatar</label>
        <div className="flex flex-wrap gap-1.5">
          {AVATARS.map(a => (
            <button
              key={a}
              onClick={() => onChange({ ...draft, avatar: a })}
              className={`text-2xl w-11 h-11 rounded-arcade grid place-items-center border-[2.5px] transition ${
                draft.avatar === a ? 'border-bk-primary bg-bk-cream shadow-arcade' : 'border-bk-ink bg-white'
              }`}
            >{a}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="label text-white text-xs uppercase tracking-techno">Niveau d'interface</label>
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ ...draft, mode_interface: 'visuel' })}
            className={`btn ${draft.mode_interface === 'visuel' ? 'btn-primary' : 'btn-ghost'} text-sm flex-1`}
          >Visuel (pré-lecteur)</button>
          <button
            onClick={() => onChange({ ...draft, mode_interface: 'texte' })}
            className={`btn ${draft.mode_interface === 'texte' ? 'btn-primary' : 'btn-ghost'} text-sm flex-1`}
          >Texte (5 ans +)</button>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        {onDelete && (
          <button className="btn-warn text-sm" onClick={onDelete} title="Retirer du foyer">
            <Trash2 size={14} />
          </button>
        )}
        <button className="btn-ghost flex-1" onClick={onCancel}>
          <X size={14} /> Annuler
        </button>
        <button className="btn-primary flex-1" onClick={onSave} disabled={!draft.prénom.trim()}>
          <Check size={14} /> {isNew ? 'Ajouter' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
