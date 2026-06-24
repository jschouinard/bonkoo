import { Link } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import {
  balanceOf, progressionOf, streakOf, levelOf,
  allPendingApprovals, pendingRedeems, pendingGameCreations, pendingGameClaims,
  todayOccurrences, jeuActif, rewardById,
} from '../../state/selectors';
import { ArrowRight, AlertOctagon, Flame, Trophy } from 'lucide-react';

// P2 (V2) — Accueil parent : carte "à approuver" dominante + cards enfants avec jeu en cours
export default function P3Dashboard() {
  const { state, dispatch } = useBonkoo();
  const parentId = state.parents[0]?.id ?? 'p-1';
  const totalAttente =
    allPendingApprovals(state).length +
    pendingRedeems(state).length +
    pendingGameCreations(state).length +
    pendingGameClaims(state).length;

  const malusLégers = state.malus.filter(m => m.actif && m.gravité === 'légère');
  const malusModérés = state.malus.filter(m => m.actif && m.gravité === 'modérée');

  const quickMalus = (childId: string) => {
    const m = malusLégers[0];
    if (!m) return;
    dispatch({ type: 'APPLY_MALUS', childId, malusId: m.id, parentId });
  };

  return (
    <div className="max-w-3xl mx-auto text-white">
      <h1 className="font-display font-extrabold text-3xl mb-1 text-white">
        Bonjour, {state.parents[0]?.prénom ?? 'parent'} 👋
      </h1>
      <p className="text-bk-parentMute text-sm font-semibold mb-5">
        Voici l'aperçu de la journée du foyer.
      </p>

      {/* Carte dominante "À approuver" (wireframe P2) */}
      <Link
        to="/parent/approvals"
        className={`card p-4 mb-5 flex items-center gap-3 transition hover:-translate-y-0.5 ${
          totalAttente > 0
            ? 'bg-bk-primary border-bk-ink text-white shadow-arcadeLg'
            : 'bg-bk-parentSurface'
        }`}
      >
        <div className={`font-display font-extrabold text-4xl leading-none ${
          totalAttente > 0 ? 'text-white' : 'text-bk-gain'
        }`}>{totalAttente || '✓'}</div>
        <div className="flex-1">
          <div className="font-display font-extrabold text-lg">
            {totalAttente > 0 ? 'à approuver' : 'tout est à jour !'}
          </div>
          <div className="text-[11px] uppercase tracking-techno font-bold opacity-80">
            {totalAttente > 0 ? 'objectif < 2 min/jour' : 'repasse après l\'heure du coucher'}
          </div>
        </div>
        {totalAttente > 0 && <ArrowRight size={24} />}
      </Link>

      <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mb-2">
        Les enfants · malus rapide
      </div>
      <div className="space-y-3">
        {state.enfants.map(c => {
          const b = balanceOf(state, c.id);
          const p = progressionOf(state, c.id);
          const s = streakOf(state, c.id);
          const occs = todayOccurrences(state, c.id);
          const done = occs.filter(o => o.statut === 'approuvé').length;
          const total = occs.length;
          const game = jeuActif(state, c.id);
          const reward = game ? rewardById(state, game.récompense_id) : undefined;

          return (
            <div key={c.id} className="card p-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-extrabold text-lg leading-none">{c.prénom}</div>
                  <div className="text-[11px] uppercase tracking-techno font-bold text-bk-parentMute mt-1">
                    {game
                      ? game.statut === 'en_attente_validation'
                        ? `⏳ veut viser ${reward?.icône} ${reward?.nom}`
                        : game.statut === 'récompense_réclamée'
                          ? `🏆 réclame sa récompense !`
                          : `${done}/${total} aujourd'hui · 🎯 ${reward?.icône}`
                      : '🎲 prêt pour un nouveau jeu'}
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <div className="font-display font-extrabold text-xl">{b}</div>
                  <div className="text-[10px] uppercase tracking-techno text-bk-parentMute font-bold">pts</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2.5">
                <span className="chip bg-bk-level text-white border-bk-ink text-[10px]">
                  <Trophy size={10} /> Niv. {levelOf(p)}
                </span>
                <span className="chip bg-bk-streak text-white border-bk-ink text-[10px]">
                  <Flame size={10} /> {s.longueur_actuelle}
                </span>
                <div className="ml-auto flex gap-1">
                  {malusLégers[0] && (
                    <button
                      onClick={() => quickMalus(c.id)}
                      className="px-2.5 py-1.5 rounded-arcade bg-bk-level text-white border-2 border-bk-ink text-[11px] font-display font-bold hover:bg-violet-600"
                      title={malusLégers[0].nom}
                    >
                      −{Math.abs(malusLégers[0].valeur_points)}
                    </button>
                  )}
                  {malusModérés[0] && (
                    <button
                      onClick={() => {
                        const m = malusModérés[0];
                        if (m) dispatch({ type: 'APPLY_MALUS', childId: c.id, malusId: m.id, parentId });
                      }}
                      className="px-2.5 py-1.5 rounded-arcade bg-bk-level text-white border-2 border-bk-ink text-[11px] font-display font-bold hover:bg-violet-600"
                      title={malusModérés[0].nom}
                    >
                      −{Math.abs(malusModérés[0].valeur_points)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Raccourcis secondaires */}
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <Link to="/parent/malus" className="card p-3 flex items-center gap-3 hover:-translate-y-0.5 transition">
          <div className="w-10 h-10 rounded-arcade bg-bk-warn text-white border-2 border-bk-ink grid place-items-center">
            <AlertOctagon size={20} />
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-sm">Malus complet</div>
            <div className="text-[10px] uppercase tracking-techno font-bold text-bk-parentMute">Choix + gravité</div>
          </div>
          <ArrowRight size={18} className="text-bk-parentMute" />
        </Link>
        <Link to="/parent/rewards" className="card p-3 flex items-center gap-3 hover:-translate-y-0.5 transition">
          <div className="w-10 h-10 rounded-arcade bg-bk-accent text-bk-ink border-2 border-bk-ink grid place-items-center">
            🎁
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-sm">Récompenses</div>
            <div className="text-[10px] uppercase tracking-techno font-bold text-bk-parentMute">
              {state.récompenses.filter(r => r.actif).length} actives
            </div>
          </div>
          <ArrowRight size={18} className="text-bk-parentMute" />
        </Link>
      </div>
    </div>
  );
}
