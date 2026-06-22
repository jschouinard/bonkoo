import { useState } from 'react';
import { useBonkoo } from '../../state/context';
import { allPendingApprovals, behaviorById, childById, pendingRedeems, rewardById } from '../../state/selectors';
import { Check, X, Pencil, Gift } from 'lucide-react';

export default function P4Approvals() {
  const { state, dispatch } = useBonkoo();
  const pending = allPendingApprovals(state);
  const redeems = pendingRedeems(state);
  const parentId = state.parents[0]?.id ?? 'p-1';

  const [editing, setEditing] = useState<string | null>(null);
  const [val, setVal] = useState<number>(0);
  const [refusingId, setRefusingId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  return (
    <div className="max-w-3xl mx-auto text-white">
      <h1 className="font-display font-extrabold text-3xl mb-1 text-white">File d'approbation</h1>
      <p className="text-bk-parentMute text-sm mb-6 font-semibold">
        {pending.length + redeems.length === 0 ? 'Tout est traité 🎉' : `${pending.length + redeems.length} élément(s) en attente.`}
      </p>

      {redeems.length > 0 && (
        <section className="mb-6">
          <h2 className="font-display font-bold mb-2 flex items-center gap-2 text-white"><Gift size={16} /> Demandes de récompense</h2>
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
                        <div className="font-display font-bold text-base">{c?.avatar} {c?.prénom} demande {r?.nom}</div>
                        <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
                          Coût : {e.coût_points} pts
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:shrink-0">
                      <button className="btn-ghost flex-1 sm:flex-none text-sm" onClick={() => dispatch({ type: 'REJECT_REDEEM', exchangeId: e.id, parentId })}>
                        <X size={14} /> Refuser
                      </button>
                      <button className="btn-gain flex-1 sm:flex-none text-sm" onClick={() => dispatch({ type: 'APPROVE_REDEEM', exchangeId: e.id, parentId })}>
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

      {pending.length > 0 && (
        <section>
          <h2 className="font-display font-bold mb-2 text-white">Déclarations à valider</h2>
          <div className="space-y-2">
            {pending.map(o => {
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
                        <div className="font-display font-bold text-base leading-tight">{c.avatar} {c.prénom} · {b.nom}</div>
                        <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-0.5">
                          Valeur par défaut : {b.valeur_points} pts
                        </div>
                      </div>
                    </div>
                    {!editingThis && !refusingThis && (
                      <div className="flex gap-2 sm:shrink-0 flex-wrap">
                        <button className="btn-ghost text-sm flex-1 sm:flex-none" onClick={() => { setEditing(o.id); setVal(b.valeur_points); }}>
                          <Pencil size={14} /> Ajuster
                        </button>
                        <button className="btn-ghost text-sm flex-1 sm:flex-none" onClick={() => { setRefusingId(o.id); setReason(''); }}>
                          <X size={14} /> Refuser
                        </button>
                        <button className="btn-gain text-sm flex-1 sm:flex-none" onClick={() => dispatch({ type: 'APPROVE_OCCURRENCE', occurrenceId: o.id, parentId })}>
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
                      <button className="btn-gain text-sm flex-1 sm:flex-none" onClick={() => { dispatch({ type: 'APPROVE_OCCURRENCE', occurrenceId: o.id, valeur: val, parentId }); setEditing(null); }}>
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
                        <button className="btn-warn flex-1" onClick={() => { dispatch({ type: 'REJECT_OCCURRENCE', occurrenceId: o.id, raison: reason, parentId }); setRefusingId(null); }}>
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

      {pending.length + redeems.length === 0 && (
        <div className="card p-8 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <div className="font-display font-extrabold text-xl">Rien à approuver pour le moment.</div>
          <div className="text-bk-parentMute text-sm font-semibold mt-1">Tu peux fermer cette fenêtre.</div>
        </div>
      )}
    </div>
  );
}
