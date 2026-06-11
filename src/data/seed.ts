import type {
  Behavior,
  BonkooState,
  Child,
  Family,
  Malus,
  Occurrence,
  Parent,
  PointTransaction,
  Reward,
  Streak,
  BehaviorAssignment,
} from '../types';
import { nowISO, todayISO, uid } from '../utils/helpers';

// ------- Bibliothèque système (modèles) — PRD A.3.2 -------

const SYS_FAMILY = 'sys';

export const systemBehaviors: Behavior[] = [
  // Matin
  { id: 'sb-brosser-m',  famille_id: null, type: 'tâche', nom: 'Brosser les dents (matin)', icône: '🪥', taille: 'petite',  valeur_points: 5,  récurrence: 'quotidienne', jours_actifs: [], routine: 'matin', est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-habiller',   famille_id: null, type: 'tâche', nom: "M'habiller seul",            icône: '👕', taille: 'petite',  valeur_points: 5,  récurrence: 'quotidienne', jours_actifs: [], routine: 'matin', est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-lit',        famille_id: null, type: 'tâche', nom: 'Faire mon lit',              icône: '🛏️', taille: 'petite',  valeur_points: 5,  récurrence: 'quotidienne', jours_actifs: [], routine: 'matin', est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-déjeuner',   famille_id: null, type: 'tâche', nom: 'Manger mon déjeuner',        icône: '🥞', taille: 'moyenne', valeur_points: 10, récurrence: 'quotidienne', jours_actifs: [], routine: 'matin', est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-école',      famille_id: null, type: 'tâche', nom: 'Préparer mon sac',           icône: '🎒', taille: 'petite',  valeur_points: 5,  récurrence: 'jours_précis', jours_actifs: ['lun','mar','mer','jeu','ven'], routine: 'matin', est_modèle_système: true, actif: true, créé_le: nowISO() },
  // Midi
  { id: 'sb-dîner',      famille_id: null, type: 'tâche', nom: 'Manger mon dîner',           icône: '🍱', taille: 'moyenne', valeur_points: 10, récurrence: 'quotidienne', jours_actifs: [], routine: 'midi', est_modèle_système: true, actif: true, créé_le: nowISO() },
  // Soir
  { id: 'sb-souper',     famille_id: null, type: 'tâche', nom: 'Manger mon souper',          icône: '🍽️', taille: 'moyenne', valeur_points: 10, récurrence: 'quotidienne', jours_actifs: [], routine: 'soir',  est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-laver',      famille_id: null, type: 'tâche', nom: 'Me laver',                   icône: '🛁', taille: 'moyenne', valeur_points: 10, récurrence: 'quotidienne', jours_actifs: [], routine: 'soir',  est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-pyjama',     famille_id: null, type: 'tâche', nom: 'Mettre mon pyjama',          icône: '🌙', taille: 'petite',  valeur_points: 5,  récurrence: 'quotidienne', jours_actifs: [], routine: 'soir',  est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-brosser-s',  famille_id: null, type: 'tâche', nom: 'Brosser les dents (soir)',   icône: '🪥', taille: 'petite',  valeur_points: 5,  récurrence: 'quotidienne', jours_actifs: [], routine: 'soir',  est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-ranger',     famille_id: null, type: 'tâche', nom: 'Ranger mes choses',          icône: '🧸', taille: 'moyenne', valeur_points: 10, récurrence: 'quotidienne', jours_actifs: [], routine: 'soir',  est_modèle_système: true, actif: true, créé_le: nowISO() },
  // Libre (consignes — toute la journée)
  { id: 'sb-écouter',    famille_id: null, type: 'consigne', nom: 'Écouter du premier coup', icône: '👂', taille: 'moyenne', valeur_points: 10, récurrence: 'quotidienne', jours_actifs: [], routine: 'libre', est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-respect',    famille_id: null, type: 'consigne', nom: 'Parler avec respect',     icône: '🗣️', taille: 'moyenne', valeur_points: 10, récurrence: 'quotidienne', jours_actifs: [], routine: 'libre', est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-calme',      famille_id: null, type: 'consigne', nom: 'Rester calme',            icône: '🧘', taille: 'grande',  valeur_points: 20, récurrence: 'quotidienne', jours_actifs: [], routine: 'libre', est_modèle_système: true, actif: true, créé_le: nowISO() },
  { id: 'sb-partager',   famille_id: null, type: 'consigne', nom: 'Partager',                icône: '🤝', taille: 'petite',  valeur_points: 5,  récurrence: 'quotidienne', jours_actifs: [], routine: 'libre', est_modèle_système: true, actif: true, créé_le: nowISO() },
];

export const systemMalus: Malus[] = [
  { id: 'sm-crier',    famille_id: null, nom: 'Crier après quelqu’un',  icône: '📢', gravité: 'modérée', valeur_points: -10, est_modèle_système: true, actif: true },
  { id: 'sm-frapper',  famille_id: null, nom: 'Frapper',                 icône: '✋', gravité: 'sévère',  valeur_points: -20, est_modèle_système: true, actif: true },
  { id: 'sm-mensonge', famille_id: null, nom: 'Mentir',                  icône: '🤥', gravité: 'modérée', valeur_points: -10, est_modèle_système: true, actif: true },
  { id: 'sm-désobéir', famille_id: null, nom: 'Ne pas écouter',          icône: '🙉', gravité: 'légère',  valeur_points: -5,  est_modèle_système: true, actif: true },
  { id: 'sm-désordre', famille_id: null, nom: 'Laisser du désordre',     icône: '🧹', gravité: 'légère',  valeur_points: -5,  est_modèle_système: true, actif: true },
];

// ------- État initial du proto (foyer démo prêt à explorer) -------

export const buildSeedState = (): BonkooState => {
  const famille: Family = {
    id: 'fam-1',
    nom: 'Famille Démo',
    pays: 'CA',
    langue: 'fr-CA',
    plancher_solde: 0,
    solde_négatif_autorisé: false,
    nip: '1234',
    créé_le: nowISO(),
  };

  const parents: Parent[] = [
    { id: 'p-1', famille_id: famille.id, prénom: 'Alex', courriel: 'alex@demo.bonkoo', rôle: 'admin', créé_le: nowISO() },
  ];

  const enfants: Child[] = [
    { id: 'k-leo', famille_id: famille.id, prénom: 'Léo', avatar: '🦁', mode_interface: 'texte',  créé_le: nowISO() },
    { id: 'k-mia', famille_id: famille.id, prénom: 'Mia', avatar: '🦊', mode_interface: 'visuel', créé_le: nowISO() },
  ];

  // Activés dans la famille — couvre les 3 moments + libre
  const activated = ['sb-brosser-m','sb-habiller','sb-déjeuner','sb-dîner','sb-souper','sb-pyjama','sb-brosser-s','sb-écouter','sb-école'];
  const comportements: Behavior[] = systemBehaviors
    .filter(b => activated.includes(b.id))
    .map(b => ({ ...b, id: 'fb-' + b.id, famille_id: famille.id, est_modèle_système: false }));

  const assignations: BehaviorAssignment[] = [];
  comportements.forEach(b => {
    enfants.forEach(e => {
      // Mia (3 ans) exemptée du sac d'école
      if (e.id === 'k-mia' && b.nom.includes('sac')) return;
      assignations.push({ id: uid('a-'), comportement_id: b.id, enfant_id: e.id });
    });
  });

  const today = todayISO();

  // Quelques occurrences pré-semées
  const occurrences: Occurrence[] = [];
  comportements.forEach(b => {
    enfants.forEach(e => {
      if (!assignations.some(a => a.comportement_id === b.id && a.enfant_id === e.id)) return;
      let statut: Occurrence['statut'] = 'à_faire';
      let valeur_créditée: number | undefined;
      let traité_le: string | undefined;
      let traité_par: string | undefined;
      let déclaré_le: string | undefined;
      // Léo : matin déjà bien avancé
      if (e.id === 'k-leo' && b.nom.includes('Brosser') && b.nom.includes('matin')) { statut = 'approuvé'; valeur_créditée = b.valeur_points; déclaré_le = nowISO(); traité_le = nowISO(); traité_par = 'p-1'; }
      if (e.id === 'k-leo' && b.nom.includes('habiller')) { statut = 'approuvé'; valeur_créditée = b.valeur_points; déclaré_le = nowISO(); traité_le = nowISO(); traité_par = 'p-1'; }
      if (e.id === 'k-leo' && b.nom.includes('déjeuner')) { statut = 'déclaré'; déclaré_le = nowISO(); }
      // Mia
      if (e.id === 'k-mia' && b.nom.includes('Brosser') && b.nom.includes('matin')) { statut = 'déclaré'; déclaré_le = nowISO(); }
      if (e.id === 'k-mia' && b.nom.includes('déjeuner')) { statut = 'approuvé'; valeur_créditée = b.valeur_points; déclaré_le = nowISO(); traité_le = nowISO(); traité_par = 'p-1'; }
      occurrences.push({
        id: uid('o-'),
        comportement_id: b.id,
        enfant_id: e.id,
        date: today,
        statut,
        valeur_créditée,
        traité_le,
        traité_par,
        déclaré_le,
      });
    });
  });

  const récompenses: Reward[] = [
    { id: 'r-écran',   famille_id: famille.id, nom: '30 min d’écran',  icône: '📱', type: 'écran',     coût_points: 50,  actif: true },
    { id: 'r-parc',    famille_id: famille.id, nom: 'Sortie au parc',  icône: '🛝', type: 'sortie',    coût_points: 100, actif: true },
    { id: 'r-jouet',   famille_id: famille.id, nom: 'Petit jouet',     icône: '🎁', type: 'objet',     coût_points: 200, actif: true },
    { id: 'r-cinéma',  famille_id: famille.id, nom: 'Soirée cinéma',   icône: '🎬', type: 'privilège', coût_points: 150, actif: true },
  ];

  // Transactions historiques (5 derniers jours) — soldes parlants
  const transactions: PointTransaction[] = [];
  const pushTx = (enfant_id: string, type: PointTransaction['type'], valeur: number, daysAgo: number, ref?: string) => {
    const d = new Date(); d.setDate(d.getDate() - daysAgo);
    transactions.push({
      id: uid('t-'),
      enfant_id,
      type,
      référence_id: ref,
      valeur_signée: valeur,
      solde_après: 0,
      créé_par: 'p-1',
      créé_le: d.toISOString(),
    });
  };
  [4, 3, 2, 1].forEach(da => {
    pushTx('k-leo', 'gain_tâche', 5, da);
    pushTx('k-leo', 'gain_tâche', 10, da);
    pushTx('k-leo', 'gain_consigne', 10, da);
  });
  // Léo aujourd'hui : 2 approuvés (matin)
  pushTx('k-leo', 'gain_tâche', 5, 0);
  pushTx('k-leo', 'gain_tâche', 5, 0);
  [3, 2, 1].forEach(da => {
    pushTx('k-mia', 'gain_tâche', 5, da);
    pushTx('k-mia', 'gain_tâche', 10, da);
  });
  pushTx('k-mia', 'gain_tâche', 10, 0); // déjeuner approuvé

  const cum: Record<string, number> = {};
  transactions
    .sort((a, b) => a.créé_le.localeCompare(b.créé_le))
    .forEach(t => {
      cum[t.enfant_id] = (cum[t.enfant_id] || 0) + t.valeur_signée;
      t.solde_après = cum[t.enfant_id];
    });

  const séries: Streak[] = [
    { enfant_id: 'k-leo', longueur_actuelle: 4, meilleure_longueur: 6, longueur_sans_malus: 4, meilleure_sans_malus: 6, dernière_date: today, paliers_atteints: [] },
    { enfant_id: 'k-mia', longueur_actuelle: 2, meilleure_longueur: 2, longueur_sans_malus: 2, meilleure_sans_malus: 2, dernière_date: today, paliers_atteints: [] },
  ];

  return {
    famille,
    parents,
    enfants,
    comportements,
    assignations,
    occurrences,
    malus: systemMalus.map(m => ({ ...m, id: 'fm-' + m.id, famille_id: famille.id, est_modèle_système: false })),
    récompenses,
    échanges: [],
    transactions,
    séries,
    notifications: [],
    onboarding_terminé: true,
  };
};

export const buildEmptyState = (): BonkooState => {
  const famille: Family = {
    id: uid('fam-'),
    nom: 'Mon foyer',
    pays: 'CA',
    langue: 'fr-CA',
    plancher_solde: 0,
    solde_négatif_autorisé: false,
    nip: '',
    créé_le: nowISO(),
  };
  return {
    famille,
    parents: [],
    enfants: [],
    comportements: [],
    assignations: [],
    occurrences: [],
    malus: [],
    récompenses: [],
    échanges: [],
    transactions: [],
    séries: [],
    notifications: [],
    onboarding_terminé: false,
  };
};

export const SYSTEM_FAMILY_ID = SYS_FAMILY;
