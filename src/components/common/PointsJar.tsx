type Props = {
  points: number;
  size?: 'sm' | 'md' | 'lg';
};

// Pot qui se remplit — repère visuel pour l'enfant
export default function PointsJar({ points, size = 'md' }: Props) {
  const dim = size === 'lg' ? 'w-20 h-24' : size === 'sm' ? 'w-10 h-12' : 'w-14 h-16';
  const txt = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-sm' : 'text-lg';
  // Jauge de remplissage basée sur paliers (0, 50, 100, 200, 400…) mais bornée
  const fill = Math.max(8, Math.min(95, (points % 100 || (points >= 100 ? 95 : 0))));
  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className={`relative ${dim} rounded-b-3xl rounded-t-lg border-2 border-bk-line bg-white overflow-hidden shadow-soft`}>
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bk-primary to-amber-300 transition-all duration-700"
          style={{ height: `${fill}%` }}
        />
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full bg-bk-line" />
      </div>
      <div className={`font-bold ${txt} text-bk-ink`}>{points} pts</div>
    </div>
  );
}
