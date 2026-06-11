import { useState } from 'react';
import { useBonkoo } from '../../state/context';
import { Lock } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function NipModal({ open, onClose, onSuccess }: Props) {
  const { state } = useBonkoo();
  const [val, setVal] = useState('');
  const [err, setErr] = useState(false);

  if (!open) return null;

  const submit = () => {
    if (!state.famille.nip || val === state.famille.nip) {
      setVal('');
      setErr(false);
      onSuccess();
    } else {
      setErr(true);
      setVal('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4" onClick={onClose}>
      <div
        className="card p-6 w-full max-w-sm animate-pop"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-2 text-bk-ink">
          <Lock size={18} />
          <h2 className="font-semibold text-lg">NIP parent</h2>
        </div>
        <p className="text-sm text-bk-mute mb-4">
          Le mode parent est verrouillé pour empêcher l'enfant d'accéder aux écrans de configuration.
        </p>
        <input
          autoFocus
          inputMode="numeric"
          maxLength={6}
          value={val}
          onChange={e => { setVal(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          className="input text-center text-2xl tracking-[0.5em] font-mono"
          placeholder="••••"
        />
        {err && <p className="text-sm text-rose-500 mt-2">NIP incorrect.</p>}
        <div className="text-xs text-bk-mute mt-3">Démo : <strong>{state.famille.nip || '(à définir)'}</strong></div>
        <div className="flex gap-2 mt-4">
          <button className="btn-ghost flex-1" onClick={onClose}>Annuler</button>
          <button className="btn-primary flex-1" onClick={submit}>Déverrouiller</button>
        </div>
      </div>
    </div>
  );
}
