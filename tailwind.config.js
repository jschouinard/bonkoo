/** @type {import('tailwindcss').Config} */
// Direction Arcade — voir design_handoff_bonkoo_v2/Bonkoo Brand & Design System.dc.html
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bk: {
          // Fonds & encres
          cream:        '#FFF6E6',     // surface enfant
          sand:         '#F0EBF7',     // bg neutre doux
          ink:          '#17141F',     // texte principal + contours
          mute:         '#8A8298',     // texte secondaire
          line:         '#17141F',     // bordures principales (ink, contour franc)
          lineSoft:     '#E5E1E8',     // bordures secondaires

          // Primaire Arcade
          primary:      '#FF5A1F',     // CTA, ancrage marque
          primaryDark:  '#E0440F',     // hover
          primaryLight: '#FFE3D1',     // fond chaud doux

          // Accents
          accent:       '#FFC42E',     // points / XP (soleil)
          accentDark:   '#E5A800',
          gain:         '#11C5C5',     // approuvé / validé (cyan)
          gainDark:     '#0EA8A8',
          gainLight:    '#D2F4EC',
          level:        '#7B5CFF',     // niveau (violet)
          streak:       '#FF2E88',     // série (magenta)
          streakSoft:   '#FFE3DD',

          // Malus — jamais rouge agressif, fond chaud sur warn
          warn:         '#FF3B1E',
          warnLight:    '#FFE3DD',
          warnBg:       '#FFE3DD',

          // Monde enfant
          kidSurface:   '#FFF6E6',
          kidDot:       '#FFE9C4',

          // Monde parent (foncé)
          parentBg:     '#17141F',
          parentSurface:'#211C2E',
          parentBorder: '#3A3348',
          parentMute:   '#9A8FB0',
          parentLight:  '#B6AEC6',
        },
      },
      fontFamily: {
        // display = titres + TOUS les chiffres (compteurs, soldes, niveaux)
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        // ui = labels, body, micro-copy
        sans:    ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        // Ombres pleines décalées — langage Arcade
        arcade:    '3px 3px 0 #17141F',
        arcadeLg:  '4px 4px 0 #17141F',
        arcadeXl:  '6px 6px 0 #17141F',
        // Variantes d'accent (jaune / cyan)
        popAccent: '6px 6px 0 #FFC42E',
        popGain:   '4px 4px 0 #11C5C5',
        popPrimary:'4px 4px 0 #FF5A1F',
      },
      borderRadius: {
        arcade:   '12px',
        arcadeLg: '16px',
        arcadeXl: '18px',
      },
      letterSpacing: {
        tightest: '-0.03em',
        techno:   '0.12em',
      },
      keyframes: {
        flame: {
          '0%, 100%': { transform: 'scale(1) rotate(-2deg)' },
          '50%':      { transform: 'scale(1.08) rotate(2deg)' },
        },
        pop: {
          '0%':   { transform: 'scale(0.6)', opacity: '0' },
          '60%':  { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        burst: {
          '0%':   { transform: 'translateY(0) scale(1)',    opacity: '1' },
          '100%': { transform: 'translateY(-40px) scale(1.4)', opacity: '0' },
        },
      },
      animation: {
        flame: 'flame 1.8s ease-in-out infinite',
        pop:   'pop 350ms ease-out both',
        burst: 'burst 700ms ease-out both',
      },
      backgroundImage: {
        'kid-dots': 'radial-gradient(#FFE9C4 2.5px, transparent 2.5px)',
      },
      backgroundSize: {
        'dots-md': '28px 28px',
      },
    },
  },
  plugins: [],
};
