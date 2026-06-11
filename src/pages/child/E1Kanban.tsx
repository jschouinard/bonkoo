import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import { behaviorById, childById, todayOccurrences, todayMalusFor } from '../../state/selectors';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import type { Occurrence, Routine } from '../../types';
import { Sparkles, ChevronRight } from 'lucide-react';

type Col = 'à_faire' | 'déclaré' | 'approuvé';

const COLS: { key: Col; label: string; emoji: string; bg: string; ring: string; chip: string }[] = [
  { key: 'à_faire', label: 'À faire',  emoji: '📌', bg: 'bg-bk-primaryLight', ring: 'ring-bk-primary/30',   chip: 'bg-bk-primary text-white' },
  { key: 'déclaré', label: "J'ai fait", emoji: '✋', bg: 'bg-bk-sand',         ring: 'ring-bk-accent/40',    chip: 'bg-bk-accent text-white' },
  { key: 'approuvé',label: 'Approuvé',  emoji: '✅', bg: 'bg-bk-gainLight',    ring: 'ring-bk-gain/40',      chip: 'bg-bk-gain text-white' },
];

const ROUTINES: { key: Routine; label: string; emoji: string }[] = [
  { key: 'matin', label: 'Matin', emoji: '🌅' },
  { key: 'midi',  label: 'Midi',  emoji: '☀️' },
  { key: 'soir',  label: 'Soir',  emoji: '🌙' },
  { key: 'libre', label: 'Toujours', emoji: '⭐' },
];

// Routine suggérée selon l'heure
const currentRoutine = (): Routine => {
  const h = new Date().getHours();
  if (h < 11) return 'matin';
  if (h < 15) return 'midi';
  return 'soir';
};

function OccCard({ o }: { o: Occurrence }) {
  const { state, dispatch } = useBonkoo();
  const b = behaviorById(state, o.comportement_id);
  const disabled = o.statut !== 'à_faire';
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: o.id,
    disabled,
  });
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };
  if (!b) return null;

  const dotColor =
    o.statut === 'approuvé' ? 'bg-bk-gain'
    : o.statut === 'déclaré' ? 'bg-bk-accent'
    : 'bg-bk-primary';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`kid-card relative rounded-2xl border-2 border-bk-line bg-white p-3 flex items-center gap-3 select-none ${!disabled ? 'cursor-grab active:cursor-grabbing hover:border-bk-primary/60 hover:shadow-card' : 'cursor-default'} ${isDragging ? 'shadow-pop' : 'shadow-soft'}`}
    >
      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${dotColor}`} />
      <div className="text-4xl shrink-0">{b.icône}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm leading-tight truncate">{b.nom}</div>
        <div className="text-xs text-bk-mute font-bold">+{b.valeur_points} pts</div>
      </div>
      {!disabled && (
        <button
          onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DECLARE_OCCURRENCE', occurrenceId: o.id }); }}
          className="shrink-0 w-9 h-9 rounded-full bg-bk-accent text-white grid place-items-center hover:bg-bk-accentDark active:scale-95"
          title="Marquer comme fait"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}

function MalusCard({ icon, name, value }: { icon: string; name: string; value: number }) {
  return (
    <div className="rounded-2xl border-2 border-bk-warn/30 bg-bk-warnLight p-3 flex items-center gap-3 shadow-soft">
      <div className="text-3xl shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm leading-tight truncate text-bk-ink">{name}</div>
        <div className="text-xs font-bold text-bk-warn">Malus · {value} pts</div>
      </div>
    </div>
  );
}

function Column({ col, children, count }: { col: typeof COLS[number]; children: React.ReactNode; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-3xl border-2 border-bk-line ${col.bg} p-3 transition ${isOver ? `ring-4 ${col.ring}` : ''}`}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-xl">{col.emoji}</span>
        <div className="font-bold text-sm">{col.label}</div>
        <span className={`ml-auto chip ${col.chip}`}>{count}</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default function E1Kanban() {
  const { childId } = useParams();
  const { state, dispatch } = useBonkoo();
  const child = childById(state, childId!)!;
  const [burst, setBurst] = useState<string | null>(null);

  const allOccs = useMemo(
    () => todayOccurrences(state, child.id).filter(o => o.statut !== 'refusé' && o.statut !== 'expiré'),
    [state, child.id],
  );
  const malusToday = useMemo(() => todayMalusFor(state, child.id), [state, child.id]);

  // Comptes par routine pour le badge sur l'onglet
  const countsByRoutine = useMemo(() => {
    const c: Record<Routine, number> = { matin: 0, midi: 0, soir: 0, libre: 0 };
    allOccs.forEach(o => {
      const b = behaviorById(state, o.comportement_id);
      const r = b?.routine ?? 'libre';
      if (o.statut === 'à_faire') c[r]++;
    });
    return c;
  }, [allOccs, state]);

  // Routine active (la 1re ayant des "à faire", sinon celle de l'heure)
  const initialTab = useMemo<Routine>(() => {
    const ordered: Routine[] = ['matin', 'midi', 'soir', 'libre'];
    const withWork = ordered.find(r => countsByRoutine[r] > 0);
    return withWork ?? currentRoutine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [tab, setTab] = useState<Routine>(initialTab);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  // Occurrences de la routine active
  const occsTab = allOccs.filter(o => (behaviorById(state, o.comportement_id)?.routine ?? 'libre') === tab);

  const grouped: Record<Col, Occurrence[]> = { 'à_faire': [], 'déclaré': [], 'approuvé': [] };
  occsTab.forEach(o => { if ((o.statut as Col) in grouped) grouped[o.statut as Col].push(o); });

  const onDragEnd = (e: DragEndEvent) => {
    const occId = e.active.id as string;
    const target = e.over?.id as Col | undefined;
    if (!target || target !== 'déclaré') return;
    dispatch({ type: 'DECLARE_OCCURRENCE', occurrenceId: occId });
    setBurst(occId);
    setTimeout(() => setBurst(null), 800);
  };

  const allDone =
    allOccs.length > 0 &&
    allOccs.every(o => o.statut === 'approuvé');

  return (
    <div className="pt-2">
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <h2 className="text-xl font-extrabold">Ma journée</h2>
        {allDone && (
          <div className="chip bg-bk-gain text-white animate-pop"><Sparkles size={12} /> Tout fait !</div>
        )}
      </div>

      {/* Tabs routine */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {ROUTINES.map(r => {
          const active = tab === r.key;
          const n = countsByRoutine[r.key];
          return (
            <button
              key={r.key}
              onClick={() => setTab(r.key)}
              className={`shrink-0 px-3 py-2 rounded-2xl border-2 font-bold text-sm flex items-center gap-2 transition ${
                active
                  ? 'bg-bk-primary text-white border-bk-primary shadow-soft'
                  : 'bg-white text-bk-mute border-bk-line hover:border-bk-primary/40'
              }`}
            >
              <span className="text-base">{r.emoji}</span>
              {r.label}
              {n > 0 && (
                <span className={`chip ${active ? 'bg-white text-bk-primary' : 'bg-bk-primaryLight text-bk-primaryDark'}`}>
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {COLS.map(col => (
            <Column key={col.key} col={col} count={grouped[col.key].length}>
              {grouped[col.key].length === 0 && (
                <div className="text-center text-bk-mute text-xs py-6 italic">
                  {col.key === 'à_faire' ? 'Rien à faire' : col.key === 'déclaré' ? 'Glisse une carte ici' : 'Bientôt !'}
                </div>
              )}
              {grouped[col.key].map(o => (
                <div key={o.id} className="relative">
                  <OccCard o={o} />
                  {burst === o.id && (
                    <div className="absolute inset-0 grid place-items-center pointer-events-none">
                      <div className="text-3xl animate-burst">✨</div>
                    </div>
                  )}
                </div>
              ))}
              {/* Malus du jour visibles dans la colonne « J'ai fait » pour que l'enfant voie ce qui s'est passé */}
              {col.key === 'déclaré' && malusToday.length > 0 && (
                <>
                  {malusToday.map(({ tx, malus }) => (
                    <MalusCard
                      key={tx.id}
                      icon={malus?.icône ?? '⚠️'}
                      name={malus?.nom ?? 'Malus'}
                      value={tx.valeur_signée}
                    />
                  ))}
                </>
              )}
            </Column>
          ))}
        </div>
      </DndContext>

      <p className="text-center text-xs text-bk-mute mt-4">
        Glisse une carte vers <strong>J'ai fait</strong> ou clique sur la flèche. Ton parent confirmera ensuite.
      </p>
    </div>
  );
}
