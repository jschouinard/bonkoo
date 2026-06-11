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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">File d'approbation</h1>
      <p className="text-bk-mute text-sm mb-6">
        {pending.length + redeems.length === 0 ? 'Tout est traité 🎉' : `${pending.length + redeems.length} élément(s) en attente.`}
      </p>

      {redeems.length > 0 && (
        <section className="mb-6">
          <h2 className="font-semibold mb-2 flex items-center gap-2"><Gift size={16} /> Demandes de récompense</h2>
          <div className="space-y-2">
            {redeems.map(e => {
              const r = rewardById(state, e.récompense_id);
              const c = childById(state, e.enfant_id);
              return (
                <div key={e.id} className="card p-3 flex items-center gap-3">
                  <div className="text-3xl">{r?.icône}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{c?.avatar} {c?.prénom} demande {r?.nom}</div>
                    <div className="text-xs text-bk-mute">Coût : {e.coût_points} pts</div>
                  </div>
                  <button className="btn-ghost" onClick={() => dispatch({ type: 'REJECT_REDEEM', exchangeId: e.id, parentId })}>
                    <X size={16} /> Refuser
                  </button>
                  <button className="btn-gain" onClick={() => dispatch({ type: 'APPROVE_REDEEM', exchangeId: e.id, parentId })}>
                    <Check size={16} /> Approuver
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {pending.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">Déclarations à valider</h2>
          <div className="space-y-2">
            {pending.map(o => {
              const b = behaviorById(state, o.comportement_id);
              const c = childById(state, o.enfant_id);
              if (!b || !c) return null;
              return (
                <div key={o.id} className="card p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{b.icône}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{c.avatar} {c.prénom} a déclaré : {b.nom}</div>
                      <div className="text-xs text-bk-mute">Valeur par défaut : {b.valeur_points} pts</div>
                    </div>
                    {editing !== o.id && refusingId !== o.id && (
                      <div className="flex gap-2">
                        <button className="btn-ghost text-sm" onClick={() => { setEditing(o.id); setVal(b.valeur_points); }}>
                          <Pencil size={14} /> Ajuster
                        </button>
                        <button className="btn-ghost text-sm" onClick={() => { setRefusingId(o.id); setReason(''); }}>
                          <X size={14} /> Refuser
                        </button>
                        <button className="btn-gain text-sm" onClick={() => dispatch({ type: 'APPROVE_OCCURRENCE', occurrenceId: o.id, parentId })}>
                          <Check size={14} /> Approuver ({b.valeur_points})
                        </button>
                      </div>
                    )}
                  </div>
                  {editing === o.id && (
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="number"
                        className="input w-24"
                        value={val}
                        onChange={e => setVal(Number(e.target.value))}
                      />
                      <button className="btn-ghost" onClick={() => setEditing(null)}>Annuler</button>
                      <button className="btn-gain" onClick={() => { dispatch({ type: 'APPROVE_OCCURRENCE', occurrenceId: o.id, valeur: val, parentId }); setEditing(null); }}>
                        Approuver avec {val} pts
                      </button>
                    </div>
                  )}
                  {refusingId === o.id && (
                    <div className="mt-3 space-y-2">
                      <input
                        className="input"
                        placeholder="Raison (facultatif)"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button className="btn-ghost" onClick={() => setRefusingId(null)}>Annuler</button>
                        <button className="btn-warn" onClick={() => { dispatch({ type: 'REJECT_OCCURRENCE', occurrenceId: o.id, raison: reason, parentId }); setRefusingId(null); }}>
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
          <div className="font-semibold">Rien à approuver pour le moment.</div>
          <div className="text-bk-mute text-sm">Tu peux fermer cette fenêtre.</div>
        </div>
      )}
    </div>
  );
}
