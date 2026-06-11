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
    <div className="card p-3 md:p-4 flex items-center gap-3 md:gap-6">
      <div className="text-4xl md:text-5xl">{child.avatar}</div>
      <div className="hidden sm:block">
        <div className="text-bk-mute text-sm">Salut</div>
        <div className="font-extrabold text-lg md:text-xl">{child.prénom}</div>
      </div>
      <div className="ml-auto flex items-center gap-3 md:gap-5">
        <PointsJar points={balance} size="md" />
        <div className="hidden sm:flex flex-col items-center">
          <div className="flex items-center gap-1 text-bk-level font-extrabold text-lg">
            <Trophy size={18} /> {progression}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-bk-mute font-bold">Niveau</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-bk-streak font-extrabold text-lg">
            <Flame size={18} /> {streak}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-bk-mute font-bold">Série</div>
        </div>
        <div className="flex flex-col items-center" title="Jours d'affilée sans malus">
          <div className="flex items-center gap-1 text-bk-gain font-extrabold text-lg">
            <ShieldCheck size={18} /> {noMalusStreak}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-bk-mute font-bold">Sans malus</div>
        </div>
      </div>
    </div>
  );
}
