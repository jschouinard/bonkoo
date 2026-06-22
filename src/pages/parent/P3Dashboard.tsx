import { Link } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { balanceOf, progressionOf, streakOf, levelOf, allPendingApprovals, pendingRedeems, todayOccurrences } from '../../state/selectors';
import { ArrowRight, CheckSquare, Gift, AlertOctagon, Flame, Trophy } from 'lucide-react';

export default function P3Dashboard() {
  const { state } = useBonkoo();
  const pendingOccs = allPendingApprovals(state);
  const pendingEx = pendingRedeems(state);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Bonjour, {state.parents[0]?.prénom ?? 'parent'} 👋</h1>
      <p className="text-bk-mute text-sm mb-6">Voici l'aperçu de la journée du foyer.</p>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <Link to="/parent/approvals" className="card p-4 hover:shadow-card transition flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-bk-sand grid place-items-center">
            <CheckSquare className="text-bk-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{pendingOccs.length + pendingEx.length}</div>
            <div className="text-xs text-bk-mute uppercase tracking-wide">En attente d'approbation</div>
          </div>
          <ArrowRight className="ml-auto text-bk-mute" />
        </Link>
        <Link to="/parent/library" className="card p-4 hover:shadow-card transition flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-bk-sand grid place-items-center text-2xl">📋</div>
          <div>
            <div className="text-2xl font-bold">{state.comportements.filter(b => b.actif).length}</div>
            <div className="text-xs text-bk-mute uppercase tracking-wide">Comportements actifs</div>
          </div>
        </Link>
        <Link to="/parent/rewards" className="card p-4 hover:shadow-card transition flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-bk-sand grid place-items-center">
            <Gift className="text-bk-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{state.récompenses.filter(r => r.actif).length}</div>
            <div className="text-xs text-bk-mute uppercase tracking-wide">Récompenses actives</div>
          </div>
        </Link>
      </div>

      <h2 className="font-semibold mb-3 text-bk-ink">Les enfants</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {state.enfants.map(c => {
          const b = balanceOf(state, c.id);
          const p = progressionOf(state, c.id);
          const s = streakOf(state, c.id);
          const occs = todayOccurrences(state, c.id);
          const done = occs.filter(o => o.statut === 'approuvé').length;
          const total = occs.length;
          return (
            <div key={c.id} className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{c.avatar}</div>
                <div>
                  <div className="font-bold text-lg">{c.prénom}</div>
                  <div className="text-xs text-bk-mute capitalize">Mode {c.mode_interface}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold">{b} pts</div>
                  <div className="text-xs text-bk-mute">solde</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-bk-cream rounded-xl p-2">
                  <div className="flex items-center justify-center gap-1 text-bk-level font-bold">
                    <Trophy size={14} /> {levelOf(p)}
                  </div>
                  <div className="text-[10px] uppercase text-bk-mute">Niveau</div>
                </div>
                <div className="bg-bk-cream rounded-xl p-2">
                  <div className="flex items-center justify-center gap-1 text-bk-streak font-bold">
                    <Flame size={14} /> {s.longueur_actuelle}
                  </div>
                  <div className="text-[10px] uppercase text-bk-mute">Série</div>
                </div>
                <div className="bg-bk-cream rounded-xl p-2">
                  <div className="font-bold">{done}/{total}</div>
                  <div className="text-[10px] uppercase text-bk-mute">Aujourd'hui</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-3">
        <Link to="/parent/malus" className="card p-4 flex items-center gap-3 hover:shadow-card transition">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-bk-warn grid place-items-center">
            <AlertOctagon size={20} />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Appliquer un malus</div>
            <div className="text-xs text-bk-mute">Conséquence douce, ne touche jamais le niveau de progression.</div>
          </div>
          <ArrowRight className="text-bk-mute" />
        </Link>
        <Link to="/parent/approvals" className="card p-4 flex items-center gap-3 hover:shadow-card transition">
          <div className="w-10 h-10 rounded-xl bg-bk-sand text-bk-primary grid place-items-center">
            <CheckSquare size={20} />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Traiter la file d'approbation</div>
            <div className="text-xs text-bk-mute">Objectif : moins de 2 min/jour.</div>
          </div>
          <ArrowRight className="text-bk-mute" />
        </Link>
      </div>
    </div>
  );
}
