/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bk: {
          // Fond chaleureux, pas jaune
          cream: '#FFF6F2',
          sand:  '#FFE3D1',
          // Texte
          ink:   '#1F2440',
          mute:  '#7B819A',
          line:  '#EAE3EC',
          // Primaire Bluey (bleu vif)
          primary:      '#2EA0E8',
          primaryDark:  '#1D7BBA',
          primaryLight: '#DCEEF9',
          // Accents
          accent:    '#FF8A4C',    // orange Bingo
          accentDark:'#E0732F',
          // Statuts
          gain:      '#6FCF97',    // vert menthe
          gainDark:  '#4FB57E',
          gainLight: '#DBF1E2',
          level:     '#9B7EDC',    // violet lavande (progression)
          streak:    '#FF6B9D',    // rose vif (série)
          streakSoft:'#FFD9E6',
          // Malus / refus : violet doux (pas de rouge)
          warn:      '#B49DDB',
          warnLight: '#EFE4FA',
          // Routines
          routineMatin: '#FFD37A',
          routineMidi:  '#FFB48C',
          routineSoir:  '#A98EE8',
        },
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(31, 36, 64, 0.06)',
        card: '0 6px 20px rgba(31, 36, 64, 0.08)',
        pop:  '0 10px 28px rgba(46, 160, 232, 0.28)',
      },
    },
  },
  plugins: [],
};
