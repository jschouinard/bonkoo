import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBonkoo } from '../../state/context';
import {
  behaviorById, childById, jaugeJeu, jeuActif,
  todayOccurrences, todayMalusFor, balanceOf,
} from '../../state/selectors';
import {
  DndContext, PointerSensor, TouchSensor,
  useSensor, useSensors, type DragEndEvent,
  useDraggable, useDroppable,
} from '@dnd-kit/core';
import type { Occurrence } from '../../types';
import { Sparkles, ChevronRight, Flame, Dice5, Trophy } from 'lucide-react';

type Col = 'à_faire' | 'déclaré' | 'approuvé';

const COLS: { key: Col; label: string; bg: string; chip: string }[] = [
  { key: 'à_faire',  label: 'À FAIRE',  bg: 'bg-[#FFE9C7] border-bk-ink', chip: 'bg-bk-primary text-white' },
  { key: 'déclaré',  label: "J'AI FAIT", bg: 'bg-[#FFF3C4] border-bk-ink', chip: 'bg-bk-accent text-bk-ink' },
  { key: 'approuvé', label: 'VALIDÉ ✓',  bg: 'bg-[#D2F4EC] border-bk-ink', chip: 'bg-bk-gain text-bk-ink' },
];

function OccCard({ o }: { o: Occurrence }) {
  const { state, dispatch } = useBonkoo();
  const b = behaviorById(state, o.comportement_id);
  const disabled = o.statut !== 'à_faire';
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: o.id, disabled });
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };
  if (!b) return null;

  const ringColor =
    o.statut === 'approuvé' ? 'shadow-popGain'
    : o.statut === 'déclaré' ? 'shadow-[3px_3px_0_#FFC42E]'
    : 'shadow-popPrimary';
  const bgCard = o.statut === 'approuvé' ? 'bg-bk-gain' : 'bg-white';
  const textCard = o.statut === 'approuvé' ? 'text-bk-ink' : 'text-bk-ink';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`kid-card rounded-arcade border-2 border-bk-ink p-2.5 flex flex-col items-center gap-1.5 ${bgCard} ${textCard} ${ringColor} select-none ${!disabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
    >
      <div className="text-2xl">{b.icône}</div>
      <div className="font-display font-bold text-[11px] text-center leading-tight">{b.nom}</div>
      {o.statut === 'approuvé' ? (
        <div className="font-display font-extrabold text-[11px]">+{o.valeur_créditée ?? b.valeur_points}</div>
      ) : o.statut === 'déclaré' ? (
        <div className="text-[9px] uppercase tracking-techno font-bold text-bk-accentDark">⏳</div>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DECLARE_OCCURRENCE', occurrenceId: o.id }); }}
          className="w-7 h-7 rounded-full bg-bk-primary text-white grid place-items-center border-2 border-bk-ink hover:bg-bk-primaryDark active:scale-95"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function MalusBanner({ items }: { items: Array<{ tx: any; malus: any }> }) {
  if (items.length === 0) return null;
  return (
    <div className="card p-3 mt-3 bg-bk-warnBg border-bk-warn flex flex-col gap-2">
      <div className="text-[11px] uppercase tracking-techno font-bold text-bk-warn">🛡️ Tu protèges ta série</div>
      {items.map(({ tx, malus }) => (
        <div key={tx.id} className="flex items-center gap-3">
          <div className="text-2xl shrink-0">{malus?.icône ?? '⚠️'}</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-sm text-bk-ink">{malus?.nom ?? 'Malus'}</div>
            <div className="text-[11px] font-bold text-bk-warn">{tx.valeur_signée} pts · niveau intact</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Column({ col, children, count }: { col: typeof COLS[number]; children: React.ReactNode; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-arcadeLg border-2 ${col.bg} p-2.5 transition ${isOver ? 'ring-4 ring-bk-accent/40' : ''}`}
    >
      <div className="flex items-center gap-1.5 mb-2 px-0.5">
        <div className="font-display font-extrabold text-[10px] tracking-techno flex-1 text-bk-ink/80">{col.label}</div>
        <span className={`chip ${col.chip} px-1.5 py-0.5 text-[10px]`}>{count}</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default function E4MyGame() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useBonkoo();
  const child = childById(state, childId!)!;
  const [burst, setBurst] = useState<string | null>(null);

  const game = jeuActif(state, child.id);
  const jauge = useMemo(() => jaugeJeu(state, child.id), [state, child.id]);
  const balance = balanceOf(state, child.id);
  const allOccs = useMemo(
    () => todayOccurrences(state, child.id).filter(o => o.statut !== 'refusé' && o.statut !== 'expiré'),
    [state, child.id],
  );
  const malusToday = useMemo(() => todayMalusFor(state, child.id), [state, child.id]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  const grouped: Record<Col, Occurrence[]> = { 'à_faire': [], 'déclaré': [], 'approuvé': [] };
  allOccs.forEach(o => { if ((o.statut as Col) in grouped) grouped[o.statut as Col].push(o); });

  const onDragEnd = (e: DragEndEvent) => {
    const occId = e.active.id as string;
    const target = e.over?.id as Col | undefined;
    if (!target || target !== 'déclaré') return;
    dispatch({ type: 'DECLARE_OCCURRENCE', occurrenceId: occId });
    setBurst(occId);
    setTimeout(() => setBurst(null), 800);
  };

  // ── EV1 : pas de jeu actif ────────────────────────────────────────────
  if (!game) {
    return (
      <div className="pt-6 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-24 h-24 rounded-full bg-white border-[3px] border-bk-ink grid place-items-center text-5xl shadow-popAccent mb-4">
          🎲
        </div>
        <div className="font-display font-extrabold text-2xl mb-1">Pas de jeu en cours !</div>
        <p className="text-bk-mute font-semibold text-sm mb-5 max-w-xs">
          Choisis ta récompense pour commencer une nouvelle partie.
        </p>
        <button className="btn-primary text-base w-full" onClick={() => navigate(`/child/${child.id}/new-game/reward`)}>
          <Dice5 size={18} /> Nouveau jeu
        </button>
      </div>
    );
  }

  // ── EV2 : jeu complété, prêt à réclamer ────────────────────────────────
  const canClaim = game.statut === 'actif' && jauge.cible && balance >= jauge.cible.coût_points;
  const alreadyClaimed = game.statut === 'récompense_réclamée';

  if (canClaim) {
    return (
      <div className="pt-4 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Jauge pleine */}
        <div className="card p-3 w-full mb-4 bg-bk-cream">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-display font-extrabold text-base">{balance}<span className="text-xs font-sans text-bk-mute"> pts</span></span>
            <div className="flex-1 h-3 rounded-full bg-white border-2 border-bk-ink overflow-hidden">
              <div className="h-full w-full bg-bk-accent" />
            </div>
            <span className="text-[10px] uppercase tracking-techno font-bold text-bk-primary">
              {jauge.cible!.icône} {jauge.cible!.coût_points}
            </span>
          </div>
        </div>
        <div className="text-6xl animate-flame mb-2">{jauge.cible!.icône}</div>
        <div className="font-display font-extrabold text-2xl mb-1">Tu as réussi ! 🎉</div>
        <p className="text-bk-mute font-semibold text-sm mb-5 max-w-xs">
          Tu as tous les points pour ta {jauge.cible!.nom.toLowerCase()}.
        </p>
        <button
          className="btn-primary text-base w-full"
          onClick={() => dispatch({ type: 'CLAIM_REWARD', gameId: game.id })}
        >
          <Trophy size={18} /> Je réclame ma récompense !
        </button>
        <p className="text-[11px] font-semibold text-bk-mute mt-2">Papa ou maman te la remet ⏳</p>
      </div>
    );
  }

  // ── E4 : jeu actif, kanban avec jauge héros ────────────────────────────
  const ratioPct = Math.round(jauge.ratio * 100);
  const allDone = allOccs.length > 0 && allOccs.every(o => o.statut === 'approuvé');

  return (
    <div className="pt-2">
      {/* HEADER HÉROS : jauge vers la récompense */}
      <div className="card p-3 mb-4 bg-bk-cream">
        {alreadyClaimed && (
          <div className="chip-xp mb-2 inline-flex">⏳ EN ATTENTE DE TA RÉCOMPENSE</div>
        )}
        {game.statut === 'en_attente_validation' && (
          <div className="chip mb-2 inline-flex">⏳ TON PARENT CONFIRME LA RÉCOMPENSE</div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-arcade bg-bk-accent border-2 border-bk-ink grid place-items-center text-3xl shrink-0">
            {jauge.cible?.icône}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-extrabold text-lg leading-none">
                {balance}<span className="text-xs font-sans text-bk-mute"> / {jauge.cible?.coût_points} pts</span>
              </span>
              <span className="text-[11px] uppercase tracking-techno font-bold text-bk-primary">
                {jauge.manque > 0 ? `+${jauge.manque} pour gagner !` : 'À toi !'}
              </span>
            </div>
            <div className="h-3 rounded-full bg-white border-2 border-bk-ink overflow-hidden">
              <div className="h-full bg-bk-accent transition-all duration-500" style={{ width: `${ratioPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <h2 className="font-display font-extrabold text-2xl">Ma journée</h2>
        {allDone && (
          <div className="chip-gain animate-pop"><Sparkles size={12} /> Tout fait !</div>
        )}
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-2">
          {COLS.map(col => (
            <Column key={col.key} col={col} count={grouped[col.key].length}>
              {grouped[col.key].length === 0 && (
                <div className="text-center text-bk-ink/40 text-[10px] py-4 italic font-bold">
                  {col.key === 'à_faire' ? '—' : col.key === 'déclaré' ? '…' : '—'}
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
            </Column>
          ))}
        </div>
      </DndContext>

      {/* Bandeau malus séparé (jamais dans une colonne — brief E4) */}
      <MalusBanner items={malusToday} />

      <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-techno font-bold text-bk-mute">
        <span>Ton parent confirme, puis les points arrivent ✨</span>
        <span className="flex items-center gap-1 text-bk-streak">
          <Flame size={12} className="animate-flame" />
          série active
        </span>
      </div>
    </div>
  );
}
