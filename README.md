# Bonkoo — prototype cliquable

Wireframes interactifs de Bonkoo, l'application web familiale de motivation par points pour enfants (5 ans +).

Construit à partir du PRD v0.3, de la Story Map et du Brief wireframes du dossier parent.

## Démarrer

```bash
npm install
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173).

## Périmètre du proto

- **19 stories MVP** (squelette ambulant)
- **Visuels V1 indispensables** : niveau de progression (deux monnaies), série, vue famille

Hors scope : co-parent, V1 complet, V2.

## Comment tester

Le proto démarre directement sur la **Famille Démo** :
- 2 enfants : **Léo** 🦁 (mode texte) et **Mia** 🦊 (mode visuel)
- Comportements pré-activés, 4 récompenses, transactions historiques
- NIP du mode parent : **`1234`**

### Parcours enfant (~30 s)
1. Sur l'écran d'accueil, clique sur **Léo** ou **Mia**
2. **Tableau du jour** : glisse une carte « À faire » vers « J'ai fait ». La carte passe en *déclaré*.
3. Onglet **Récompenses** : choisis une récompense atteignable, demande-la.
4. Onglet **Famille** : tu vois la progression de la fratrie (sans podium).

### Parcours parent (~1 min)
1. Écran d'accueil → **Mode parent** → NIP `1234`.
2. **Accueil parent** : vois le compteur d'approbations en attente.
3. **File d'approbation** : approuve, refuse ou ajuste les déclarations + demande de rachat.
4. **Appliquer un malus** : choisis un enfant + un malus dans la bibliothèque (le niveau de progression reste intact — vérifie sur le dashboard).
5. **Bibliothèques** : active de nouveaux modèles ou crée un comportement personnalisé.
6. **Récompenses** : ajoute une récompense.

### Repartir à zéro
- **Réinitialiser le proto** (lien discret sur l'écran d'accueil) restaure le seed
- Le compte **Créer mon compte parent** vide tout et démarre l'onboarding 4-étapes complet (P1 + P2)

## Architecture

| Dossier | Rôle |
|---|---|
| `src/types/` | Modèle de données A.5 du PRD |
| `src/data/seed.ts` | Bibliothèque système (11 comportements + 5 malus) + foyer de démo |
| `src/state/` | Context + reducer + actions + selectors. Grand livre immuable ; solde & progression sont **dérivés** |
| `src/utils/persistence.ts` | localStorage (bouton Reset disponible) |
| `src/components/parent/` | Layout parent + garde NIP |
| `src/components/child/` | Layout enfant + en-tête persistant (jauge solde / progression / série) |
| `src/pages/` | L1 + P1–P7 + E1–E3 |

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 3 (palette warm bk-* sand/cream/primary/gain/level/streak)
- React Router 7
- dnd-kit (drag & drop tactile-friendly pour le kanban enfant)
- lucide-react (icônes UI parent) + emojis (icônes obligatoires des comportements/récompenses)

## Cartographie écrans → stories MVP

| Story # | Écran |
|---|---|
| 1, 2, 8 | P1 + P2 (étape 4 NIP) |
| 3 | P2 étape 1 |
| 4 | P2 étape 2, P6 |
| 5 | P2 (auto-assignation) + P6 |
| 6 | P2 étape 3, P7 |
| 7 | L1 |
| 9, 10 | E1 (kanban + drag) |
| 11, 13 | P4 |
| 12 | P4 (approbation) |
| 14, 15, 19 | E1 (en-tête persistant), ChildHeader |
| 16, 17 | E2 |
| 18 | P4 (section récompenses) |

## Notes de design

- **Pas de rouge agressif** : malus en violet doux (`bk-warn`), refus neutres
- **Pas de podium** sur la vue famille : présentation côte à côte
- **Solde toujours visible** côté enfant (jauge `PointsJar` dans `ChildHeader`)
- **Niveau de progression ne baisse jamais** : reducer crédite uniquement les types `gain_*` et `bonus_série` au sélecteur `progressionOf`
- **Icône obligatoire** sur les comportements : émojis pour reconnaissance pré-lecture
