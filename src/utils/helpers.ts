export const uid = (prefix = ''): string =>
  prefix + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

export const todayISO = (): string => new Date().toISOString().slice(0, 10);
export const nowISO = (): string => new Date().toISOString();

export const dayOfWeek = (iso: string): 'lun' | 'mar' | 'mer' | 'jeu' | 'ven' | 'sam' | 'dim' => {
  const d = new Date(iso).getDay();
  return (['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'] as const)[d];
};

export const formatPoints = (n: number): string => (n > 0 ? `+${n}` : `${n}`);

export const dateLabel = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('fr-CA', { hour: '2-digit', minute: '2-digit' });
};
