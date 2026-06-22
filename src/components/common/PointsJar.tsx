type Props = {
  points: number;
};

// Jauge XP Arcade — pastille soleil + chiffre Bricolage + barre rayée
export default function PointsJar({ points }: Props) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bk-accent rounded-arcade border-2 border-bk-ink shadow-arcade">
      <span className="w-5 h-5 rounded-full bg-white border-2 border-bk-ink" />
      <span className="font-display font-extrabold text-xl leading-none text-bk-ink">{points}</span>
      <span className="text-[9px] uppercase tracking-techno font-bold text-bk-ink/70 hidden sm:inline">pts</span>
    </div>
  );
}
