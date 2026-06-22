// Constantes d'économie — D6 V2
// Seul endroit où vivent les chiffres ; modifiables sans toucher la logique.
// Re-export des constantes officielles du modèle de données.
export { SEUILS_NIVEAUX, NIVEAU_REQUIS_SUGGÉRÉ } from '../types';
import { SEUILS_NIVEAUX } from '../types';

// Pour un niveau donné, retourne le seuil qui le déverrouille.
// Niv 1 = 0 pts, Niv 2 = 75 pts, Niv 3 = 200, etc. Au-delà du dernier
// seuil défini, on extrapole +500/niveau (cf. brief §1 D6).
export const seuilDuNiveau = (niveau: number): number => {
  if (niveau <= 1) return 0;
  const last = SEUILS_NIVEAUX.length - 1;
  if (niveau - 1 <= last) return SEUILS_NIVEAUX[niveau - 1]!;
  // ensuite +500 par niveau
  return SEUILS_NIVEAUX[last]! + 500 * (niveau - 1 - last);
};

// Bonus de série — paliers en jours consécutifs et bonus en points associé.
// Crédités automatiquement quand longueur_actuelle franchit un palier.
export const PALIERS_SERIE: Array<{ jours: number; bonus: number }> = [
  { jours: 5,  bonus: 10 },
  { jours: 14, bonus: 25 },
  { jours: 30, bonus: 50 },
];
