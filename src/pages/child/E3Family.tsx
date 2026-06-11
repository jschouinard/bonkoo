import { useParams } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { balanceOf, progressionOf, streakOf } from '../../state/selectors';
import { Flame, Trophy } from 'lucide-react';

export default function E3Family() {
  const { childId } = useParams();
  const { state } = useBonkoo();

  return (
    <div className="pt-2">
      <h2 className="text-xl font-bold mb-1">Ma famille</h2>
      <p className="text-bk-mute text-sm mb-4">On avance ensemble — pas de classement.</p>

      <div className="space-y-3">
        {state.enfants.map(c => {
          const isMe = c.id === childId;
          const balance = balanceOf(state, c.id);
          const prog = progressionOf(state, c.id);
          const s = streakOf(state, c.id);
          return (
            <div key={c.id} className={`card p-4 flex items-center gap-3 ${isMe ? 'ring-2 ring-bk-primary' : ''}`}>
              <div className="text-5xl">{c.avatar}</div>
              <div className="flex-1">
                <div className="font-bold text-lg">{c.prénom}{isMe && <span className="ml-2 chip bg-bk-primary text-white">moi</span>}</div>
                <div className="text-xs text-bk-mute">Solde : <strong>{balance} pts</strong></div>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <div className="flex items-center gap-1 text-bk-level font-bold"><Trophy size={14} /> {prog}</div>
                <div className="flex items-center gap-1 text-bk-streak font-bold"><Flame size={14} /> {s.longueur_actuelle}</div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-bk-mute mt-6">
        Chacun avance à son rythme. Le but, c'est ta propre série ! 🔥
      </p>
    </div>
  );
}
