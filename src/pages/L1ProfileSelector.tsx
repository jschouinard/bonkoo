import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBonkoo } from '../state/context';
import NipModal from '../components/common/NipModal';
import { RotateCcw, ShieldCheck, UserPlus } from 'lucide-react';
import { clearState } from '../utils/persistence';

export default function L1ProfileSelector() {
  const { state, dispatch } = useBonkoo();
  const navigate = useNavigate();
  const [askNip, setAskNip] = useState(false);

  const hasAccount = state.parents.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 shell-kid">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-arcadeLg bg-bk-primary text-white grid place-items-center font-display font-extrabold text-4xl border-[2.5px] border-bk-ink shadow-arcadeLg leading-none">b</div>
        <div className="flex flex-col gap-1">
          <span className="wordmark text-5xl text-bk-ink">bonkoo</span>
          <div className="h-2.5 w-full rounded-full bg-bk-ink/10 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-2/3 bg-bk-primary rounded-full" />
            <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-bk-accent border-2 border-bk-ink" />
          </div>
          <p className="text-bk-mute text-xs font-bold uppercase tracking-techno mt-0.5">Qui joue ?</p>
        </div>
      </div>

      {!hasAccount ? (
        <div className="card p-8 max-w-md w-full text-center">
          <p className="text-bk-ink mb-4 font-semibold">Bienvenue ! Pour commencer, crée ton compte parent.</p>
          <button className="btn-primary w-full text-base" onClick={() => navigate('/signup')}>
            <UserPlus size={18} /> Créer mon compte parent
          </button>
          <div className="mt-4 text-xs text-bk-mute">
            ou{' '}
            <button
              className="underline hover:text-bk-ink font-bold"
              onClick={() => { dispatch({ type: 'LOAD_SEED' }); }}
            >
              charger un foyer de démo
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl w-full">
            {state.enfants.map(child => (
              <button
                key={child.id}
                onClick={() => navigate(`/child/${child.id}/today`)}
                className="card p-6 flex flex-col items-center gap-3 hover:-translate-y-0.5 hover:shadow-arcadeXl transition kid-card"
              >
                <div className="text-6xl">{child.avatar}</div>
                <div className="font-display font-extrabold text-2xl text-bk-ink leading-none">{child.prénom}</div>
                <div className="chip-primary">Mode enfant</div>
              </button>
            ))}
            <button
              onClick={() => setAskNip(true)}
              className="card p-6 flex flex-col items-center justify-center gap-3 hover:-translate-y-0.5 hover:shadow-arcadeXl transition border-dashed bg-bk-cream"
            >
              <div className="w-16 h-16 rounded-arcade bg-bk-ink text-white grid place-items-center border-2 border-bk-ink">
                <ShieldCheck size={32} />
              </div>
              <div className="font-display font-extrabold text-lg text-bk-ink">Mode parent</div>
              <div className="chip">🔒 NIP</div>
            </button>
          </div>

          <button
            className="mt-10 text-xs text-bk-mute hover:text-bk-ink flex items-center gap-1 font-bold uppercase tracking-techno"
            onClick={() => {
              if (confirm('Réinitialiser le proto au foyer de démo ?')) {
                clearState();
                sessionStorage.removeItem('bk:unlocked');
                dispatch({ type: 'LOAD_SEED' });
              }
            }}
          >
            <RotateCcw size={12} /> Réinitialiser le proto
          </button>
        </>
      )}

      <NipModal
        open={askNip}
        onClose={() => setAskNip(false)}
        onSuccess={() => {
          sessionStorage.setItem('bk:unlocked', '1');
          setAskNip(false);
          navigate('/parent');
        }}
      />
    </div>
  );
}
