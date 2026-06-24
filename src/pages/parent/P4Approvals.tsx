import { useState } from 'react';
import { useBonkoo } from '../../state/context';
import {
  allPendingApprovals, behaviorById, childById,
  pendingRedeems, rewardById, pendingGameCreations, pendingGameClaims,
} from '../../state/selectors';
import { Check, X, Pencil, Gift, Dice5, Trophy } from 'lucide-react';

// P3 (V2) — file d'approbation unifiée à 3 sections + Tout approuver.
export default function P4Approvals() {
  const { state, dispatch } = useBonkoo();
  const declarations = allPendingApprovals(state);
  const redeems = pendingRedeems(state);
  const gameCreations = pendingGameCreations(state);
  const gameClaims = pendingGameClaims(state);
  const parentId = state.parents[0]?.id ?? 'p-1';

  const [editing, setEditing] = useState<string | null>(null);
  const [val, setVal] = useState<number>(0);
  const [refusingId, setRefusingId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const totalItems =
    declarations.length + redeems.length + gameCreations.length + gameClaims.length;

  const approveAll = () => {
    if (totalItems > 5 && !confirm(`Approuver les ${totalItems} éléments en attente ?`)) return;
    declarations.forEach(o =>
      dispatch({ type: 'APPROVE_OCCURRENCE', occurrenceId: o.id, parentId }),
    );
    redeems.forEach(e =>
      dispatch({ type: 'APPROVE_REDEEM', exchangeId: e.id, parentId }),
    );
    gameCreations.forEach(g =>
      dispatch({ type: 'APPROVE_GAME', gameId: g.id, parentId }),
    );
    gameClaims.forEach(g =>
      dispatch({ type: 'APPROVE_CLAIM', gameId: g.id, parentId }),
    );
  };

  // ── EV3 : file vide ─────────────────────────────────────────────────────
  if (totalItems === 0) {
    return (
      <div className="max-w-2xl mx-auto text-white">
        <h1 className="font-display font-extrabold text-3xl mb-6 text-white">À valider</h1>
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-bk-gain text-bk-ink grid place-items-center font-display font-extrabold text-3xl border-[2.5px] border-bk-ink shadow-arcade">
            ✓
          </div>
          <div className="font-display font-extrabold text-xl">Tout est à jour !</div>
          <p className="text-bk-parentMute text-sm font-semibold mt-1">
            Aucune déclaration en attente. Repasse après l'heure du coucher.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto text-white">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h1 className="font-display font-extrabold text-3xl text-white">
          À valider · <span className="text-bk-primary">{totalItems}</span>
        </h1>
        {totalItems > 1 && (
          <button className="btn-gain text-sm" onClick={approveAll}>
            <Check size={14} /> Tout approuver
          </button>
        )}
      </div>

      {/* ── Section 1 : créations de jeu (D1) ──────────────────────────────── */}
      {gameCreations.length > 0 && (
        <section className="mb-5">
          <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mb-2 flex items-center gap-2">
            <Dice5 size={12} /> Nouveaux jeux à valider
          </div>
          <div className="space-y-2">
            {gameCreations.map(g => {
              const r = rewardById(state, g.récompense_id);
              const c = childById(state, g.enfant_id);
              return (
                <div key={g.id} className="card p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-3xl shrink-0">{r?.icône}</div>
                      <div className="min-w-0">
                        <div className="font-display font-bold text-base">
                          {c?.avatar} {c?.prénom} veut viser : {r?.nom}
                        </div>
                        <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
                          Objectif {r?.coût_points} pts · Niv. {r?.niveau_requis} requis
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:shrink-0">
                      <button
                        className="btn-ghost flex-1 sm:flex-none text-sm"
                        onClick={() => dispatch({ type: 'REJECT_GAME', gameId: g.id, parentId })}
                      >
                        <X size={14} /> Refuser
                      </button>
                      <button
                        className="btn-gain flex-1 sm:flex-none text-sm"
                        onClick={() => dispatch({ type: 'APPROVE_GAME', gameId: g.id, parentId })}
                      >
                        <Check size={14} /> Approuver le jeu
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Section 2 : réclamations de récompense (D4) ────────────────────── */}
      {gameClaims.length > 0 && (
        <section className="mb-5">
          <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mb-2 flex items-center gap-2">
            <Trophy size={12} /> Réclamations de récompense
          </div>
          <div className="space-y-2">
            {gameClaims.map(g => {
              const r = rewardById(state, g.récompense_id);
              const c = childById(state, g.enfant_id);
              return (
                <div key={g.id} className="card p-3 border-bk-accent">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-3xl shrink-0">{r?.icône}</div>
                      <div className="min-w-0">
                        <div className="font-display font-bold text-base">
                          {c?.avatar} {c?.prénom} a réussi son jeu : {r?.nom}
                        </div>
                        <div className="text-[11px] uppercase tracking-techno font-bold text-bk-primary mt-0.5">
                          −{r?.coût_points} pts · à remettre 🎁
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:shrink-0">
                      <button
                        className="btn-ghost flex-1 sm:flex-none text-sm"
                        onClick={() => dispatch({ type: 'REJECT_CLAIM', gameId: g.id, parentId })}
                      >
                        <X size={14} /> Refuser
                      </button>
                      <button
                        className="btn-accent flex-1 sm:flex-none text-sm"
                        onClick={() => dispatch({ type: 'APPROVE_CLAIM', gameId: g.id, parentId })}
                      >
                        <Check size={14} /> Récompense remise
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Section 3 : rachats libres (compat V1) ────────────────────────── */}
      {redeems.length > 0 && (
        <section className="mb-5">
          <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mb-2 flex items-center gap-2">
            <Gift size={12} /> Demandes de récompense
          </div>
          <div className="space-y-2">
            {redeems.map(e => {
              const r = rewardById(state, e.récompense_id);
              const c = childById(state, e.enfant_id);
              return (
                <div key={e.id} className="card p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-3xl shrink-0">{r?.icône}</div>
                      <div className="min-w-0">
                        <div className="font-display font-bold text-base">
                          {c?.avatar} {c?.prénom} demande {r?.nom}
                        </div>
                        <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
                          Coût : {e.coût_points} pts
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:shrink-0">
                      <button
                        className="btn-ghost flex-1 sm:flex-none text-sm"
                        onClick={() => dispatch({ type: 'REJECT_REDEEM', exchangeId: e.id, parentId })}
                      >
                        <X size={14} /> Refuser
                      </button>
                      <button
                        className="btn-gain flex-1 sm:flex-none text-sm"
                        onClick={() => dispatch({ type: 'APPROVE_REDEEM', exchangeId: e.id, parentId })}
                      >
                        <Check size={14} /> Approuver
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Section 4 : déclarations de bonkoo ─────────────────────────────── */}
      {declarations.length > 0 && (
        <section>
          <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mb-2 flex items-center gap-2">
            ✋ Déclarations de bonkoo
          </div>
          <div className="space-y-2">
            {declarations.map(o => {
              const b = behaviorById(state, o.comportement_id);
              const c = childById(state, o.enfant_id);
              if (!b || !c) return null;
              const editingThis = editing === o.id;
              const refusingThis = refusingId === o.id;
              return (
                <div key={o.id} className="card p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-3xl shrink-0">{b.icône}</div>
                      <div className="min-w-0">
                        <div className="font-display font-bold text-base leading-tight">
                          {c.avatar} {c.prénom} · {b.nom}
                        </div>
                        <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
                          Valeur par défaut : {b.valeur_points} pts
                        </div>
                      </div>
                    </div>
                    {!editingThis && !refusingThis && (
                      <div className="flex gap-2 sm:shrink-0 flex-wrap">
                        <button
                          className="btn-ghost text-sm flex-1 sm:flex-none"
                          onClick={() => { setEditing(o.id); setVal(b.valeur_points); }}
                        >
                          <Pencil size={14} /> Ajuster
                        </button>
                        <button
                          className="btn-ghost text-sm flex-1 sm:flex-none"
                          onClick={() => { setRefusingId(o.id); setReason(''); }}
                        >
                          <X size={14} /> Refuser
                        </button>
                        <button
                          className="btn-gain text-sm flex-1 sm:flex-none"
                          onClick={() => dispatch({ type: 'APPROVE_OCCURRENCE', occurrenceId: o.id, parentId })}
                        >
                          <Check size={14} /> Approuver (+{b.valeur_points})
                        </button>
                      </div>
                    )}
                  </div>
                  {editingThis && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        className="input w-24"
                        value={val}
                        onChange={e => setVal(Number(e.target.value))}
                      />
                      <button className="btn-ghost text-sm" onClick={() => setEditing(null)}>Annuler</button>
                      <button
                        className="btn-gain text-sm flex-1 sm:flex-none"
                        onClick={() => { dispatch({ type: 'APPROVE_OCCURRENCE', occurrenceId: o.id, valeur: val, parentId }); setEditing(null); }}
                      >
                        Approuver avec {val} pts
                      </button>
                    </div>
                  )}
                  {refusingThis && (
                    <div className="mt-3 space-y-2">
                      <input
                        className="input"
                        placeholder="Raison (facultatif)"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button className="btn-ghost flex-1" onClick={() => setRefusingId(null)}>Annuler</button>
                        <button
                          className="btn-warn flex-1"
                          onClick={() => { dispatch({ type: 'REJECT_OCCURRENCE', occurrenceId: o.id, raison: reason, parentId }); setRefusingId(null); }}
                        >
                          Confirmer le refus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <p className="mt-5 text-center text-[11px] uppercase tracking-techno font-bold text-bk-parentMute">
        Approuver → les points s'animent côté enfant ✨
      </p>
    </div>
  );
}
