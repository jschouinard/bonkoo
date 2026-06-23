import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useBonkoo } from '../../state/context';
import { balanceOf, jaugeJeu, levelOf, progressionOf, rewardById } from '../../state/selectors';

// ─── Confettis Arcade ───────────────────────────────────────────────────
const Confetti = () => (
  <>
    {Array.from({ length: 18 }).map((_, i) => {
      const colors = ['#FF5A1F', '#11C5C5', '#FF2E88', '#FFC42E', '#7B5CFF'];
      const color = colors[i % colors.length];
      const left = Math.random() * 100;
      const delay = Math.random() * 0.4;
      const rotate = Math.random() * 360;
      return (
        <span
          key={i}
          className="absolute top-0 inline-block rounded-sm border border-bk-ink"
          style={{
            left: `${left}%`,
            width: 9,
            height: 12,
            background: color,
            transform: `rotate(${rotate}deg)`,
            animation: `confetti-fall 1.5s ease-out ${delay}s both`,
          }}
        />
      );
    })}
    <style>{`
      @keyframes confetti-fall {
        0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(280px) rotate(540deg); opacity: 0; }
      }
    `}</style>
  </>
);

// ─── C1 : Toast "+10 ✨" sur gain de points ──────────────────────────────
export function XpToast({ value, onDone }: { value: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-x-0 bottom-28 z-40 grid place-items-center pointer-events-none">
      <div className="relative px-6 py-3 bg-bk-accent border-[3px] border-bk-ink rounded-arcadeLg shadow-arcadeLg animate-pop">
        <div className="font-display font-extrabold text-2xl text-bk-ink">+{value} ✨</div>
      </div>
    </div>
  );
}

// ─── C2 / C3 : modal plein écran ─────────────────────────────────────────
function FullScreenCelebration({
  bg, children, onClose,
}: { bg: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className={`relative w-full max-w-sm ${bg} border-[3px] border-bk-ink rounded-arcadeXl shadow-arcadeXl p-6 text-center animate-pop overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        <Confetti />
        {children}
      </div>
    </div>
  );
}

export function RewardUnlockedModal({
  icon, name, onClose,
}: { icon: string; name: string; onClose: () => void }) {
  return (
    <FullScreenCelebration bg="bg-[#FFF4D6]" onClose={onClose}>
      <div className="text-6xl mb-2 animate-flame">{icon}</div>
      <div className="font-display font-extrabold text-2xl leading-tight mb-1">RÉCOMPENSE<br/>DÉBLOQUÉE !</div>
      <div className="text-[11px] uppercase tracking-techno font-bold text-bk-primary mt-2">{icon} {name} — demande-la !</div>
      <button onClick={onClose} className="btn-primary text-sm mt-5 w-full">Génial !</button>
    </FullScreenCelebration>
  );
}

export function LevelUpModal({ niveau, onClose }: { niveau: number; onClose: () => void }) {
  return (
    <FullScreenCelebration bg="bg-gradient-to-br from-bk-primary to-bk-streak" onClose={onClose}>
      <div className="text-5xl mb-2 animate-flame">🎉</div>
      <div className="font-display font-extrabold text-3xl text-white mb-2">NIVEAU {niveau} !</div>
      <div className="chip-xp inline-flex mt-1">le niveau ne redescend jamais</div>
      <button onClick={onClose} className="btn-dark text-sm mt-5 w-full">Continuer</button>
    </FullScreenCelebration>
  );
}

// ─── Orchestrateur : watch state, trigger les célébrations ───────────────
// Détecte : gain de points → C1 toast ; balance traverse coût → C2 ; level monte → C3.
export function GameEventsListener({ childId }: { childId: string }) {
  const { state } = useBonkoo();

  const balance = balanceOf(state, childId);
  const niveau = levelOf(progressionOf(state, childId));
  const jauge = jaugeJeu(state, childId);

  const prevBalance = useRef<number | null>(null);
  const prevLevel = useRef<number | null>(null);
  const lastUnlockedGameId = useRef<string | null>(null);

  const [toast, setToast] = useState<{ value: number; key: number } | null>(null);
  const [unlocked, setUnlocked] = useState<{ icon: string; name: string } | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);

  // C1 — toast +XP quand le solde monte
  useEffect(() => {
    if (prevBalance.current !== null && balance > prevBalance.current) {
      const delta = balance - prevBalance.current;
      setToast({ value: delta, key: Date.now() });
    }
    prevBalance.current = balance;
  }, [balance]);

  // C3 — level up
  useEffect(() => {
    if (prevLevel.current !== null && niveau > prevLevel.current) {
      setLevelUp(niveau);
    }
    prevLevel.current = niveau;
  }, [niveau]);

  // C2 — récompense débloquée (jauge atteint 100 % pour la 1re fois sur ce jeu)
  useEffect(() => {
    if (
      jauge.game &&
      jauge.game.statut === 'actif' &&
      jauge.cible &&
      jauge.ratio >= 1 &&
      lastUnlockedGameId.current !== jauge.game.id
    ) {
      lastUnlockedGameId.current = jauge.game.id;
      const cible = rewardById(state, jauge.game.récompense_id);
      if (cible) setUnlocked({ icon: cible.icône, name: cible.nom });
    }
  }, [jauge.ratio, jauge.game, jauge.cible, state]);

  return (
    <>
      {toast && (
        <XpToast key={toast.key} value={toast.value} onDone={() => setToast(null)} />
      )}
      {unlocked && (
        <RewardUnlockedModal icon={unlocked.icon} name={unlocked.name} onClose={() => setUnlocked(null)} />
      )}
      {levelUp !== null && (
        <LevelUpModal niveau={levelUp} onClose={() => setLevelUp(null)} />
      )}
    </>
  );
}
