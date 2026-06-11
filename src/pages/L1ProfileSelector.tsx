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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-bk-cream to-bk-sand/40">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-bk-primary text-white grid place-items-center font-bold text-3xl shadow-pop">B</div>
        <div>
          <h1 className="text-3xl font-bold leading-tight">Bonkoo</h1>
          <p className="text-bk-mute text-sm">Qui utilise l'app ?</p>
        </div>
      </div>

      {!hasAccount ? (
        <div className="card p-8 max-w-md w-full text-center">
          <p className="text-bk-ink mb-4">Bienvenue ! Pour commencer, crée ton compte parent.</p>
          <button className="btn-primary w-full" onClick={() => navigate('/signup')}>
            <UserPlus size={18} /> Créer mon compte parent
          </button>
          <div className="mt-4 text-xs text-bk-mute">
            ou{' '}
            <button
              className="underline hover:text-bk-ink"
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
                className="card p-6 flex flex-col items-center gap-3 hover:shadow-card hover:-translate-y-0.5 transition kid-card"
              >
                <div className="text-6xl">{child.avatar}</div>
                <div className="font-bold text-lg">{child.prénom}</div>
                <div className="chip">Mode enfant</div>
              </button>
            ))}
            <button
              onClick={() => setAskNip(true)}
              className="card p-6 flex flex-col items-center justify-center gap-3 hover:shadow-card hover:-translate-y-0.5 transition border-dashed"
            >
              <div className="w-16 h-16 rounded-2xl bg-bk-sand grid place-items-center">
                <ShieldCheck size={32} className="text-bk-primary" />
              </div>
              <div className="font-bold">Mode parent</div>
              <div className="text-xs text-bk-mute">Verrouillé par NIP</div>
            </button>
          </div>

          <button
            className="mt-10 text-xs text-bk-mute hover:text-bk-ink flex items-center gap-1"
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
