import type { Child } from '../../types';
import PointsJar from '../common/PointsJar';
import { Flame, Trophy, ShieldCheck } from 'lucide-react';

type Props = {
  child: Child;
  balance: number;
  progression: number;
  streak: number;
  noMalusStreak: number;
};

export default function ChildHeader({ child, balance, progression, streak, noMalusStreak }: Props) {
  return (
    <div className="card p-3 md:p-4 flex items-center gap-3 md:gap-5">
      <div className="text-4xl md:text-5xl">{child.avatar}</div>
      <div className="hidden sm:block">
        <div className="font-sans text-[11px] uppercase tracking-techno text-bk-mute font-bold">Salut</div>
        <div className="font-display font-extrabold text-xl md:text-2xl text-bk-ink leading-none mt-0.5">{child.prénom}</div>
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <PointsJar points={balance} />
        <div className="flex flex-col items-center gap-1 px-2.5 py-1.5 bg-bk-level text-white rounded-arcade border-2 border-bk-ink shadow-arcade">
          <div className="flex items-center gap-1 font-display font-extrabold text-base leading-none">
            <Trophy size={14} /> {progression}
          </div>
          <div className="text-[9px] uppercase tracking-techno font-bold opacity-90">Niveau</div>
        </div>
        <div className="flex flex-col items-center gap-1 px-2.5 py-1.5 bg-bk-streak text-white rounded-arcade border-2 border-bk-ink shadow-arcade">
          <div className="flex items-center gap-1 font-display font-extrabold text-base leading-none">
            <Flame size={14} className="animate-flame" /> {streak}
          </div>
          <div className="text-[9px] uppercase tracking-techno font-bold opacity-90">Série</div>
        </div>
        <div
          className="hidden sm:flex flex-col items-center gap-1 px-2.5 py-1.5 bg-bk-gain text-bk-ink rounded-arcade border-2 border-bk-ink shadow-arcade"
          title="Jours d'affilée sans malus"
        >
          <div className="flex items-center gap-1 font-display font-extrabold text-base leading-none">
            <ShieldCheck size={14} /> {noMalusStreak}
          </div>
          <div className="text-[9px] uppercase tracking-techno font-bold">Sans malus</div>
        </div>
      </div>
    </div>
  );
}
