import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { childById, jeuActif, levelOf, progressionOf } from '../../state/selectors';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';

// E2 — Nouveau jeu, étape 1 : l'enfant choisit sa récompense cible
export default function E2NewGameReward() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { state } = useBonkoo();
  const child = childById(state, childId!)!;
  const niveau = levelOf(progressionOf(state, child.id));
  const [selected, setSelected] = useState<string | null>(null);

  // S'il a déjà un jeu actif, rediriger vers E4
  if (jeuActif(state, child.id)) {
    navigate(`/child/${child.id}/today`, { replace: true });
    return null;
  }

  const actives = state.récompenses.filter(r => r.actif);

  return (
    <div className="pt-2">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-bk-mute hover:text-bk-ink font-bold text-sm mb-3">
        <ArrowLeft size={16} /> Retour
      </button>

      {/* Stepper */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 chip-primary py-2 justify-center">1 · Récompense 🎁</div>
        <div className="flex-1 chip py-2 justify-center opacity-60">2 · Bonkoo ✅</div>
      </div>

      <h2 className="font-display font-extrabold text-2xl mb-1">Choisis ta récompense 🎯</h2>
      <p className="text-sm text-bk-mute font-semibold mb-4">C'est ce que tu vas gagner à la fin du jeu.</p>

      <div className="flex flex-col gap-3 mb-4">
        {actives.map(r => {
          const locked = r.niveau_requis > niveau;
          const isSelected = selected === r.id;
          return (
            <button
              key={r.id}
              disabled={locked}
              onClick={() => setSelected(r.id)}
              className={`card p-3 flex items-center gap-3 transition text-left ${
                isSelected ? 'border-bk-primary shadow-popPrimary' : ''
              } ${locked ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              <div className={`w-12 h-12 rounded-arcade border-2 border-bk-ink grid place-items-center text-2xl shrink-0 ${
                locked ? 'bg-bk-cream grayscale' : 'bg-bk-accent'
              }`}>
                {r.icône}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-base text-bk-ink leading-tight">{r.nom}</div>
                <div className="font-display font-extrabold text-sm text-bk-primary mt-0.5">{r.coût_points} pts</div>
              </div>
              {locked ? (
                <div className="chip flex items-center gap-1"><Lock size={10} /> Niv. {r.niveau_requis}</div>
              ) : isSelected ? (
                <div className="w-7 h-7 rounded-full bg-bk-primary text-white grid place-items-center font-bold border-2 border-bk-ink shrink-0">✓</div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-bk-cream border-2 border-bk-ink shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {actives.length === 0 && (
        <div className="card p-8 text-center border-dashed">
          <div className="text-5xl mb-3">🎁</div>
          <div className="font-display font-extrabold text-xl">Aucune récompense !</div>
          <p className="text-sm text-bk-mute font-semibold mt-2 max-w-xs mx-auto">
            Demande à papa ou maman d'en ajouter dans le mode parent pour démarrer un jeu.
          </p>
        </div>
      )}

      <button
        className="btn-primary w-full text-base mt-2"
        disabled={!selected}
        onClick={() => navigate(`/child/${child.id}/new-game/bonkoo?reward=${selected}`)}
      >
        Continuer <ArrowRight size={18} />
      </button>
    </div>
  );
}
