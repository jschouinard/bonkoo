import { useParams } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { levelOf, progressionOf, streakOf } from '../../state/selectors';
import { Flame, Trophy } from 'lucide-react';

// E6 — Vue famille V2 : pas de podium, pas de solde chiffré des autres
//      (niveau + 🔥 seulement). "Moi" mis en valeur.
export default function E6Family() {
  const { childId } = useParams();
  const { state } = useBonkoo();

  return (
    <div className="pt-2">
      <h2 className="font-display font-extrabold text-2xl mb-1">Ma famille</h2>
      <p className="text-sm text-bk-mute font-semibold mb-4">On avance ensemble — pas de classement.</p>

      <div className="space-y-3">
        {state.enfants.map(c => {
          const isMe = c.id === childId;
          const niveau = levelOf(progressionOf(state, c.id));
          const série = streakOf(state, c.id).longueur_actuelle;
          return (
            <div
              key={c.id}
              className={`card p-3 flex items-center gap-3 ${
                isMe ? 'border-bk-level shadow-[3px_3px_0_#7B5CFF]' : ''
              }`}
            >
              <div className="text-4xl shrink-0">{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-extrabold text-lg leading-none flex items-center gap-2">
                  {c.prénom}
                  {isMe && <span className="chip-xp px-1.5 py-0.5 text-[9px]">MOI</span>}
                </div>
                <div className="text-[11px] uppercase tracking-techno font-bold text-bk-level mt-1 flex items-center gap-1">
                  <Trophy size={10} /> Niveau {niveau}
                </div>
              </div>
              <div className="flex items-center gap-1 text-bk-streak font-display font-extrabold text-xl shrink-0">
                <Flame size={20} className="animate-flame" />
                {série}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] uppercase tracking-techno text-bk-mute font-bold mt-6">
        Chacun sa série — pas de solde affiché 👍
      </p>
    </div>
  );
}
